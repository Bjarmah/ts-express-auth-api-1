import express from 'express';
import { getProfile, getPublicData, deleteUser, updateProfile, getUsers } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/profile', authenticateJWT, getProfile);
router.get('/users', authenticateJWT, isAdmin, getUsers);
router.delete('/users/:id', authenticateJWT, isAdmin, deleteUser);
router.patch('/profile', authenticateJWT, updateProfile);
router.get('/public', getPublicData);

export default router;