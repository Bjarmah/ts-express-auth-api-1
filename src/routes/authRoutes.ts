import express from 'express';
import {
    register,
    login,
    assignRole, verifyOTP, AuthController
} from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';
import { loginLimiter } from '../middleware/rate-limit';

const authController = new AuthController();
const router = express.Router();

// Public routes (no authentication required)
router.post('/register', loginLimiter, register as any);
router.post('/login', loginLimiter, login as any);
router.post('/verifyOTP', verifyOTP as any);


// Protected routes
router.post('/assign-role', authenticateJWT, isAdmin, assignRole as any); // Only admins can assign roles

router.get('/auth/google', authController.googleAuthRedirect);
router.get('/auth/google/callback', authController.googleCallback);

export default router;