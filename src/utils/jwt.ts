import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';


const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const generateToken = (user: User) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

export const verifyToken = (token: string) => {
    console.log("Token received for verification:", token);
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
