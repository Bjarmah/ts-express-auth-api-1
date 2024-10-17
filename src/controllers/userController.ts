import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user";
import AppDataSource from "../config/database";
// Type declaration for extended Request
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

// Users
export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);
    const userID = req.user?.id;

    if (!userID) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const user = await userRepository.findOne({ where: { id: userID } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }
};

// Admin
export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        const users = await userRepository.find();
        res.json(
            users.map(user => ({
                id: user.id,
                email: user.email,
                role: user.role
            }))
        );
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Admin
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);
    const userID = req.params.id; // Fixed: access the id parameter correctly

    if (!userID) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    try {
        const user = await userRepository.findOne({ where: { id: userID } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await userRepository.delete(user.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

export const updateProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = req.user;
    const { email } = req.body;

    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    try {
        await userRepository.update(user.id, { email });
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

export const getPublicData = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.json({
        message: "This is the public data",
        timestamp: new Date().toISOString()
    });
};


/**import { Request, Response, NextFunction } from 'express';
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
}; */