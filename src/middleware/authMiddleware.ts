// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { verifyToken } from '../utils/jwt';
import AppDataSource from '../config/database';

export const authenticateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ message: 'No authorization header' });
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const decoded = verifyToken(token) as any;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: decoded.id }
        });

        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({
            message: 'Invalid or expired token',
            error: (error as Error).message
        });
    }
};