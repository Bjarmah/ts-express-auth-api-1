import express from 'express';
import {
    register,
    login,
    assignRole, verifyOTP
} from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';
import { loginLimiter } from '../middleware/rate-limit';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', loginLimiter, register as any);
router.post('/login', loginLimiter, login as any);
router.post('/verifyOTP', verifyOTP as any);


// Protected routes
router.post('/assign-role', authenticateJWT, isAdmin, assignRole as any); // Only admins can assign roles

export default router;