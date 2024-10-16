import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user";

// export const checkRole = (role: UserRole) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (req.user && req.user.role === role) {
//             next();
//         } else {
//             res.sendStatus(403).json({ message: 'Unauthorized, Access Denied' });
//         }
//     };
// };

export const checkRole = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized - No user found' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: 'Forbidden - You do not have permission to access this resource'
            });
            return;
        }

        next();
    };
};


export const isAdmin = checkRole([UserRole.ADMIN]);
export const isUser = checkRole([UserRole.USER]);
export const isGuest = checkRole([UserRole.GUEST]);

