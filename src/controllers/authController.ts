import { Request, Response } from "express";
import { User, UserRole } from "../models/user";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import AppDataSource from "../config/database";

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
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({
            where: { email: req.body.email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateToken(user);
        res.json({ token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(400).json({
            message: "Error logging in",
            error: (error as Error).message
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