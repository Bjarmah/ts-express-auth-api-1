import express from 'express';
import { getProfile, getPublicData, deleteUser, updateProfile, getUsers } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/profile', authenticateJWT, getProfile);
router.get('/', authenticateJWT, isAdmin, getUsers);
router.patch('/profile', authenticateJWT, updateProfile);

router.get('/public', getPublicData);

//Role Assigning endpoint
router.delete('/delete/:id', authenticateJWT, isAdmin, deleteUser);

export default router;

