import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user";

// Extend Express Request type to include user
declare module 'express' {
    interface Request {
        user?: {
            id: string;
            role: UserRole;
            email: string;
        };
    }
}

/**
 * Middleware factory that creates role-based access control
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const checkRole = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Debug logging
        console.log('Current user:', req.user);
        console.log('Allowed roles:', allowedRoles);

        // Check if user exists in request
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized - Authentication required'
            }); return;
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Forbidden - Required roles: ${allowedRoles.join(', ')}`
            }); return;
        }

        next();
    };
};

// Predefined middleware for common role checks
export const isAdmin = checkRole([UserRole.ADMIN]);
export const isUser = checkRole([UserRole.USER]);
export const isGuest = checkRole([UserRole.GUEST]);

// Combined role checks
export const isAdminOrUser = checkRole([UserRole.ADMIN, UserRole.USER]);
export const isUserOrGuest = checkRole([UserRole.USER, UserRole.GUEST]);
export const anyRole = checkRole([UserRole.ADMIN, UserRole.USER, UserRole.GUEST]);