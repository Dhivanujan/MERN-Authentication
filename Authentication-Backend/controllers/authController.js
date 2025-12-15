import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

const normaliseEmail = (value = '') => value.trim().toLowerCase();
const trimValue = (value = '') => value.trim();

const buildUserPayload = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  profilePhoto: user.profilePhoto,
  lastLogin: user.lastLogin,
});

const generateAccessAndRefreshTokens = async (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  await User.findByIdAndUpdate(userId, { refreshToken });

  return { accessToken, refreshToken };
};

const setCookies = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const handleDuplicateKey = (error, res) => {
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'Field';
    return res.status(400).json({ message: `${field} is already in use` });
  }
  throw error;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const username = trimValue(req.body.username);
  const email = normaliseEmail(req.body.email);
  const password = req.body.password?.toString() || '';
  const profilePhoto = req.body.profilePhoto || null;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  if (!profilePhoto) {
    return res.status(400).json({ message: 'Profile photo is required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let user;
  try {
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePhoto,
    });
  } catch (error) {
    return handleDuplicateKey(error, res);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  setCookies(res, refreshToken);

  return res.status(201).json({
    user: buildUserPayload(user),
    token: accessToken,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const password = req.body.password?.toString() || '';

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  setCookies(res, refreshToken);

  return res.json({
    user: buildUserPayload(user),
    token: accessToken,
  });
});

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public (Cookie)
export const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.refreshToken;
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });

  const foundUser = await User.findOne({ refreshToken });

  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403); // Forbidden
      // Delete refresh tokens of hacked user
      const hackedUser = await User.findById(decoded.id);
      if (hackedUser) {
        hackedUser.refreshToken = ''; // Invalidate
        await hackedUser.save();
      }
    });
    return res.sendStatus(403); // Forbidden
  }

  // Evaluate jwt
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, async (err, decoded) => {
    if (err || foundUser._id.toString() !== decoded.id) return res.sendStatus(403);

    // Refresh token was still valid
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(foundUser._id);

    setCookies(res, newRefreshToken);

    res.json({ token: accessToken });
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204); // No content

  const refreshToken = cookies.refreshToken;
  const foundUser = await User.findOne({ refreshToken });

  if (foundUser) {
    foundUser.refreshToken = '';
    await foundUser.save();
  }

  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Update user profile photo
// @route   PUT /api/auth/profile-photo
// @access  Private
export const updateProfilePhoto = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  const profilePhoto = trimValue(req.body.profilePhoto);

  if (!id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (!profilePhoto) {
    return res.status(400).json({ message: 'Profile photo is required' });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { profilePhoto },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user: buildUserPayload(user) });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  if (!id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user });
});

// @desc    Update account details
// @route   PUT /api/auth/update
// @access  Private
export const updateAccount = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  if (!id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const username = trimValue(req.body.username || '');
  const email = normaliseEmail(req.body.email || '');
  const password = req.body.password?.toString();

  const updates = {};
  if (username) updates.username = username;
  if (email) updates.email = email;

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(password, salt);
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: 'No updates were provided' });
  }

  let user;
  try {
    user = await User.findByIdAndUpdate(id, updates, { new: true });
  } catch (error) {
    return handleDuplicateKey(error, res);
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
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
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  // In a real app, send email here. For now, we log it.
  console.log(`Reset Password URL: ${resetUrl}`);

  try {
    // await sendEmail({ ... });
    res.status(200).json({ success: true, data: 'Email sent (check console for link)' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ message: 'Email could not be sent' });
  }
});

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  // Set new password
  const password = req.body.password?.toString();
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  setCookies(res, refreshToken);

  return res.status(200).json({
    success: true,
    token: accessToken,
    user: buildUserPayload(user),
  });
});
