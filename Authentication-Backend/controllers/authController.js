import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import speakeasy from "speakeasy";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";

const ACCESS_TTL = "15m";
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_SESSIONS = 5;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const getRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET or JWT_REFRESH_SECRET must be set for refresh tokens");
  }
  return secret;
};

const normaliseEmail = (value = "") => value.trim().toLowerCase();
const trimValue = (value = "") => value.trim();
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const generateRandomToken = (bytes = 64) => crypto.randomBytes(bytes).toString("hex");

const buildRefreshJwt = (userId, sessionId) =>
  jwt.sign({ sub: userId.toString(), sid: sessionId }, getRefreshSecret(), {
    expiresIn: `${Math.floor(REFRESH_TTL_MS / 1000)}s`,
  });

const fingerprintRequest = (req) => {
  const rawIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
  const ip = rawIp.split(",")[0].trim();
  const userAgent = req.headers["user-agent"] || "unknown";
  const country = (req.headers["cf-ipcountry"] || req.headers["x-country"] || "unknown").toString();
  const sessionLabel = req.headers["x-device-label"] || undefined;
  return { ip, userAgent, country, sessionLabel };
};

const isAnomaly = (user, fp) => {
  if (!user.lastIp && !user.lastCountry && !user.lastUserAgent) return false;
  return (
    (user.lastIp && user.lastIp !== fp.ip) ||
    (user.lastCountry && user.lastCountry !== fp.country) ||
    (user.lastUserAgent && user.lastUserAgent !== fp.userAgent)
  );
};

const buildUserPayload = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  profilePhoto: user.profilePhoto,
  lastLogin: user.lastLogin,
  isEmailVerified: user.isEmailVerified,
  mfaEnabled: user.mfaEnabled,
});

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, isEmailVerified: user.isEmailVerified, mfaEnabled: user.mfaEnabled },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );

const setRefreshCookie = (res, refreshToken) => {
  const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
  const sameSite = secure ? "none" : "lax";
  const domain = process.env.COOKIE_DOMAIN || undefined;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    domain,
    maxAge: REFRESH_TTL_MS,
  });
};

const clearRefreshCookie = (res) => {
  const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
  const sameSite = secure ? "none" : "lax";
  const domain = process.env.COOKIE_DOMAIN || undefined;

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite,
    secure,
    domain,
  });
};

const createRefreshSession = async (user, req) => {
  const sessionId = generateRandomToken(16);
  const refreshToken = buildRefreshJwt(user._id, sessionId);
  const tokenHash = hashToken(refreshToken);
  const now = Date.now();
  const fp = fingerprintRequest(req);

  const entry = {
    sessionId,
    tokenHash,
    createdAt: new Date(now),
    lastUsedAt: new Date(now),
    expiresAt: new Date(now + REFRESH_TTL_MS),
    ip: fp.ip,
    userAgent: fp.userAgent,
    country: fp.country,
    sessionLabel: fp.sessionLabel,
  };

  user.refreshTokens = (user.refreshTokens || []).filter((rt) => rt.expiresAt > new Date(now));
  user.refreshTokens.push(entry);
  if (user.refreshTokens.length > MAX_SESSIONS) {
    user.refreshTokens = user.refreshTokens.slice(-MAX_SESSIONS);
  }

  await user.save();
  return refreshToken;
};

const rotateRefreshSession = async (user, currentHash, req) => {
  user.refreshTokens = (user.refreshTokens || []).filter((rt) => rt.tokenHash !== currentHash && rt.expiresAt > new Date());
  return createRefreshSession(user, req);
};

const handleDuplicateKey = (error, res) => {
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "Field";
    return res.status(400).json({ message: `${field} is already in use` });
  }
  throw error;
};

const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  const minLength = 8;
  const hasMinLength = password.length >= minLength;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (hasMinLength && hasLower && hasUpper && hasNumber && hasSymbol) {
    return null;
  }

  return "Password must be at least 8 characters and include upper, lower, number, and symbol";
};

const createEmailVerification = (user) => {
  const token = generateRandomToken(20);
  user.emailVerificationToken = hashToken(token);
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return token;
};

const createMagicLink = (user) => {
  const token = generateRandomToken(24);
  user.magicLinkToken = hashToken(token);
  user.magicLinkExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return token;
};

const verifyTotp = (secret, token) =>
  Boolean(
    secret &&
    speakeasy.totp.verify({ secret, encoding: "base32", token, window: 1 })
  );

const generateBackupCodes = () =>
  Array.from({ length: 8 }).map(() => generateRandomToken(5));

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const username = trimValue(req.body.username);
  const email = normaliseEmail(req.body.email);
  const password = req.body.password?.toString() || "";
  const profilePhoto = req.body.profilePhoto || null;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  if (!profilePhoto) {
    return res.status(400).json({ message: "Profile photo is required" });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userId = new mongoose.Types.ObjectId();

  let user;
  try {
    user = await User.create({
      _id: userId,
      username,
      email,
      password: hashedPassword,
      profilePhoto,
    });
  } catch (error) {
    return handleDuplicateKey(error, res);
  }

  const verificationToken = createEmailVerification(user);
  await user.save();
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
  const verificationUrl = `${frontendUrl.replace(/\/$/, "")}/verify-email/${verificationToken}`;
  console.log(`Verify email URL: ${verificationUrl}`);

  return res.status(201).json({
    user: buildUserPayload(user),
    message: "Account created. Please verify your email.",
    verificationUrl,
  });
});

// @desc    Login user (with lockout, anomaly detection, MFA)
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const password = req.body.password?.toString() || "";
  const totp = req.body.totp?.toString();
  const backupCode = req.body.backupCode?.toString();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.lockUntil && user.lockUntil > Date.now()) {
    const unlocksInMs = user.lockUntil.getTime() - Date.now();
    return res.status(429).json({ message: `Account locked. Try again in ${Math.ceil(unlocksInMs / 1000)}s` });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_WINDOW_MS);
    }
    await user.save();
    return res.status(401).json({ message: "Invalid credentials" });
  }

  user.loginAttempts = 0;
  user.lockUntil = null;

  if (!user.isEmailVerified) {
    const verificationToken = createEmailVerification(user);
    await user.save();
    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
    const verificationUrl = `${frontendUrl.replace(/\/$/, "")}/verify-email/${verificationToken}`;
    console.log(`Verify email URL: ${verificationUrl}`);
    return res.status(403).json({
      message: "Email not verified. Verification link re-issued.",
      requiresEmailVerification: true,
      verificationUrl,
    });
  }

  // MFA gate
  if (user.mfaEnabled) {
    const validTotp = totp && verifyTotp(user.totpSecret, totp);
    let validBackup = false;
    if (backupCode) {
      const codeHash = hashToken(backupCode);
      validBackup = user.backupCodes.includes(codeHash);
      if (validBackup) {
        user.backupCodes = user.backupCodes.filter((c) => c !== codeHash);
      }
    }

    if (!validTotp && !validBackup) {
      await user.save();
      return res.status(403).json({ message: "MFA required", requiresMfa: true });
    }
  }

  const fp = fingerprintRequest(req);
  const anomaly = isAnomaly(user, fp);

  if (anomaly && !user.mfaEnabled) {
    const magicToken = createMagicLink(user);
    await user.save();
    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
    const magicUrl = `${frontendUrl.replace(/\/$/, "")}/magic-login/${magicToken}`;
    console.log(`Magic link (anomaly): ${magicUrl}`);
    return res.status(401).json({
      message: "New device/location detected. Use the magic link sent to your email.",
      requiresMagicLink: true,
      magicUrl,
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await createRefreshSession(user, req);

  user.lastLogin = new Date();
  user.lastIp = fp.ip;
  user.lastUserAgent = fp.userAgent;
  user.lastCountry = fp.country;
  await user.save();

  setRefreshCookie(res, refreshToken);

  return res.json({
    user: buildUserPayload(user),
    token: accessToken,
    anomalyDetected: anomaly,
  });
});

// @desc    Refresh Access Token (rotating, hashed, reuse detection)
// @route   POST /api/auth/refresh
// @access  Public (Cookie)
export const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.refreshToken;
  clearRefreshCookie(res);

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, getRefreshSecret());
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }

  const tokenHash = hashToken(refreshToken);
  const user = await User.findById(decoded.sub);

  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const matchingToken = (user.refreshTokens || []).find((rt) => rt.tokenHash === tokenHash && rt.sessionId === decoded.sid);

  if (!matchingToken) {
    // Token reuse or revoked; revoke all sessions defensively
    user.refreshTokens = [];
    await user.save();
    return res.status(403).json({ message: "Refresh token reuse detected" });
  }

  if (matchingToken.expiresAt < new Date()) {
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.tokenHash !== tokenHash);
    await user.save();
    return res.status(403).json({ message: "Refresh token expired" });
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = await rotateRefreshSession(user, tokenHash, req);
  setRefreshCookie(res, newRefreshToken);

  return res.json({
    token: accessToken,
    user: buildUserPayload(user),
  });
});

// @desc    Logout user (single session)
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204);

  const refreshToken = cookies.refreshToken;
  const tokenHash = hashToken(refreshToken);
  const foundUser = await User.findOne({ "refreshTokens.tokenHash": tokenHash });

  if (foundUser) {
    foundUser.refreshTokens = foundUser.refreshTokens.filter((rt) => rt.tokenHash !== tokenHash);
    await foundUser.save();
  }

  clearRefreshCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Revoke all sessions
// @route   POST /api/auth/sessions/revoke-all
// @access  Private
export const revokeAllSessions = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Not authorized" });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.refreshTokens = [];
  await user.save();
  clearRefreshCookie(res);
  return res.json({ message: "All sessions revoked" });
});

// @desc    Update user profile photo
// @route   PUT /api/auth/profile-photo
// @access  Private
export const updateProfilePhoto = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  const profilePhoto = trimValue(req.body.profilePhoto);

  if (!id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!profilePhoto) {
    return res.status(400).json({ message: "Profile photo is required" });
  }

  const user = await User.findByIdAndUpdate(id, { profilePhoto }, { new: true });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: buildUserPayload(user) });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  if (!id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const user = await User.findById(id).select("-password -totpSecret -totpTempSecret -magicLinkToken -magicLinkExpire").lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
});

// @desc    Update account details
// @route   PUT /api/auth/update
// @access  Private
export const updateAccount = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  if (!id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const username = trimValue(req.body.username || "");
  const email = normaliseEmail(req.body.email || "");
  const password = req.body.password?.toString();

  const updates = {};
  if (username) updates.username = username;
  if (email) updates.email = email;

  if (password) {
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(password, salt);
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: "No updates were provided" });
  }

  let user;
  try {
    user = await User.findByIdAndUpdate(id, updates, { new: true });
  } catch (error) {
    return handleDuplicateKey(error, res);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: buildUserPayload(user) });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = generateRandomToken(20);

  user.resetPasswordToken = hashToken(resetToken);
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
  const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

  console.log(`Reset Password URL: ${resetUrl}`);

  return res.status(200).json({ success: true, data: "Email sent (check console for link)", resetUrl });
});

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = hashToken(req.params.resetToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const password = req.body.password?.toString();
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  user.refreshTokens = [];
  const accessToken = generateAccessToken(user);
  const refreshToken = await createRefreshSession(user, req);

  await user.save();

  setRefreshCookie(res, refreshToken);

  return res.status(200).json({
    success: true,
    token: accessToken,
    user: buildUserPayload(user),
  });
});

// @desc    Verify email
// @route   POST /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const tokenHash = hashToken(req.params.token);
  const user = await User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Verification token invalid or expired" });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  return res.json({ message: "Email verified", user: buildUserPayload(user) });
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = asyncHandler(async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified" });

  const token = createEmailVerification(user);
  await user.save();
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
  const verificationUrl = `${frontendUrl.replace(/\/$/, "")}/verify-email/${token}`;
  console.log(`Verify email URL: ${verificationUrl}`);

  return res.json({ message: "Verification link re-sent", verificationUrl });
});

// @desc    Start MFA setup
// @route   POST /api/auth/mfa/setup
// @access  Private
export const startMfaSetup = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const secret = speakeasy.generateSecret({ length: 20, name: process.env.ISSUER || "Auth App" });
  user.totpTempSecret = secret.base32;
  await user.save();

  return res.json({ base32: secret.base32, otpauthUrl: secret.otpauth_url });
});

// @desc    Verify MFA setup
// @route   POST /api/auth/mfa/verify
// @access  Private
export const verifyMfaSetup = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const token = req.body.totp?.toString();
  const user = await User.findById(userId);
  if (!user || !user.totpTempSecret) return res.status(400).json({ message: "No MFA setup in progress" });

  const valid = verifyTotp(user.totpTempSecret, token);
  if (!valid) return res.status(400).json({ message: "Invalid TOTP" });

  user.totpSecret = user.totpTempSecret;
  user.totpTempSecret = undefined;
  user.mfaEnabled = true;
  const backupCodes = generateBackupCodes();
  user.backupCodes = backupCodes.map((code) => hashToken(code));
  await user.save();

  return res.json({ message: "MFA enabled", backupCodes });
});

// @desc    Disable MFA
// @route   POST /api/auth/mfa/disable
// @access  Private
export const disableMfa = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const totp = req.body.totp?.toString();
  const user = await User.findById(userId);
  if (!user || !user.mfaEnabled) return res.status(400).json({ message: "MFA not enabled" });

  const valid = verifyTotp(user.totpSecret, totp);
  if (!valid) return res.status(401).json({ message: "Invalid TOTP" });

  user.totpSecret = undefined;
  user.totpTempSecret = undefined;
  user.mfaEnabled = false;
  user.backupCodes = [];
  await user.save();

  return res.json({ message: "MFA disabled" });
});

// @desc    Request magic link
// @route   POST /api/auth/magic-link
// @access  Public
export const requestMagicLink = asyncHandler(async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = createMagicLink(user);
  await user.save();
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
  const magicUrl = `${frontendUrl.replace(/\/$/, "")}/magic-login/${token}`;
  console.log(`Magic link URL: ${magicUrl}`);

  return res.json({ message: "Magic link issued", magicUrl });
});

// @desc    Magic link login
// @route   POST /api/auth/magic-login
// @access  Public
export const magicLogin = asyncHandler(async (req, res) => {
  const token = req.body.token?.toString();
  if (!token) return res.status(400).json({ message: "Token required" });
  const tokenHash = hashToken(token);
  const user = await User.findOne({ magicLinkToken: tokenHash, magicLinkExpire: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "Invalid or expired magic link" });

  user.magicLinkToken = undefined;
  user.magicLinkExpire = undefined;
  user.isEmailVerified = true;

  const accessToken = generateAccessToken(user);
  const refreshToken = await createRefreshSession(user, req);

  user.lastLogin = new Date();
  const fp = fingerprintRequest(req);
  user.lastIp = fp.ip;
  user.lastUserAgent = fp.userAgent;
  user.lastCountry = fp.country;
  await user.save();

  setRefreshCookie(res, refreshToken);
  return res.json({ user: buildUserPayload(user), token: accessToken });
});
