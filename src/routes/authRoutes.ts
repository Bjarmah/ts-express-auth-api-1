import express from 'express';
import {
    register,
    login,
    assignRole
} from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);


// Protected routes
router.post('/assign-role', authenticateJWT, isAdmin, assignRole); // Only admins can assign roles

export default router;