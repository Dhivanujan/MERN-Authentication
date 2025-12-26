import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    ip: String,
    userAgent: String,
    country: String,
    sessionLabel: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    refreshTokens: { type: [refreshTokenSchema], default: [] },
    lastLogin: { type: Date, default: null },
    lastIp: { type: String, default: null },
    lastUserAgent: { type: String, default: null },
    lastCountry: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    totpSecret: String,
    totpTempSecret: String,
    mfaEnabled: { type: Boolean, default: false },
    backupCodes: { type: [String], default: [] },
    magicLinkToken: String,
    magicLinkExpire: Date,
    forceReauth: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;