// backend/routes/authRoutes.js
import express from 'express';
import { register, login, updateProfilePhoto, getMe, updateAccount } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile-photo', protect, updateProfilePhoto);
router.put('/update', protect, updateAccount);

export default router;
