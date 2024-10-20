import { Request, Response } from "express";
import { User, UserRole } from "../models/user";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import AppDataSource from "../config/database";
import logger from "../utils/logger";
import { OTP } from "../models/otp";
import { sendOTPEmail } from "../services/OTPService";
import { AuthService } from '../services/authService';
import { googleClient } from '../config/googleAuth';

export const register = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        // Check if user already exists
        const existingUser = await userRepository.findOne({
            where: { email: req.body.email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Create new user
        const user = userRepository.create({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || UserRole.USER
        });

        // Save user
        await userRepository.save(user);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({
            message: "Error creating user",
            error: (error as Error).message
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const otpRepository = AppDataSource.getRepository(OTP);

    try {

        // Find user and verify password
        const user = await userRepository.findOne({
            where: { email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("OTP: ", otp);
        // Save OTP with 15-minute expiration
        const otpEntity = otpRepository.create({
            email: user.email,
            code: otp,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });

        await otpRepository.save(otpEntity);


        // Send OTP via email
        await sendOTPEmail(user.email, otp);

        // For testing purposes, include OTP in response (remove in production)
        res.json({
            success: true,
            message: 'OTP sent successfully',
            email: user.email,
            testingOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
            expiresIn: '15 minutes'
        });

    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login process',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
    }
};


export const assignRole = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({
            where: { id: req.body.id }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate role
        if (!Object.values(UserRole).includes(req.body.role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        user.role = req.body.role;
        await userRepository.save(user);

        res.json({
            message: "Role assigned successfully",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Role assignment error:", error);
        res.status(400).json({
            message: "Error assigning role",
            error: (error as Error).message
        });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const otpRepository = AppDataSource.getRepository(OTP);

    try {
        // Find the most recent unused OTP from the database
        const otpRecord = await otpRepository.findOne({
            where: {
                email,
                used: false
            },
            order: { createdAt: 'DESC' }
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'No valid OTP found'
            });
        }

        // Check expiration
        if (new Date() > otpRecord.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired',
                expirationTime: otpRecord.expiresAt
            });
        }

        // Verify OTP
        if (otpRecord.code !== otp) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Mark OTP as used
        otpRecord.used = true;
        await otpRepository.save(otpRecord);

        // Generate JWT token
        const user = await userRepository.findOne({ where: { email } });
        const token = generateToken(user!);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            tokenExpiresIn: '24h'
        });

    } catch (error) {
        logger.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during OTP verification',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
    }
};



//Treat the class as a file on its, own
export class AuthController {
    private authService = new AuthService();

    async googleAuthRedirect(req: Request, res: Response) {
        const url = googleClient.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        });
        res.redirect(url);
    }

    async googleCallback(req: Request, res: Response) {
        try {
            const { code } = req.query;
            if (!code || typeof code !== 'string') {
                throw new Error('Invalid authorization code');
            }

            const result = await this.authService.googleLogin(code);
            res.json(result);
        } catch (error) {
            logger.error('Google callback error:', error);
            res.status(500).json({ error: 'Authentication failed' });
        }
    }
}