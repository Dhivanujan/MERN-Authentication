// backend/routes/authRoutes.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout, updateProfilePhoto, getMe, updateAccount, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const forgotPasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: 'Too many password reset requests. Please try again later.' },
});

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.put('/reset-password/:resetToken', forgotPasswordLimiter, resetPassword);
router.get('/me', protect, getMe);
router.put('/profile-photo', protect, updateProfilePhoto);
router.put('/update', protect, updateAccount);

export default router;
