import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/user';
import { verifyToken } from '../utils/jwt';

export const authenticateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.sendStatus(401);
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyToken(token);
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(payload.id);

        if (user) {
            req.user = user;
            next();
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(403);
    }
};