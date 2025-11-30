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

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

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

  return res.status(201).json({
    user: buildUserPayload(user),
    token: signToken(user._id),
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

  return res.json({
    user: buildUserPayload(user),
    token: signToken(user._id),
  });
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
