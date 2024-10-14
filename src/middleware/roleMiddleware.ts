import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user";

export const checkRole = (role: UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.sendStatus(403).json({ message: 'Unauthorized, Access Denied' });
        }
    };
};

