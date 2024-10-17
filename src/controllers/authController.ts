import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User, UserRole } from "../models/user";
import bycrpt from "bcrypt";
import { generateToken } from "../utils/jwt";
import AppDataSource from "../config/database";


export const register = async (req: Request, res: Response) => {
    //Note the reques contains the email and password of the user
    try {

        const userRepository = AppDataSource.getRepository(User); // Get the user repository
        const newUser = userRepository.create(req.body); // Create a new user and save in the newUser variable
        await userRepository.save(newUser); // Save the new user to database
        res.json(userRepository).send("User created successfully: " + newUser);
    } catch (error) {
        res.status(400).send(error + "\nUser not created, Error Registering user");
    }

}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({ where: req.body.email });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        const valid = await bycrpt.compare(req.body.password, user.password);

        if (!valid) {
            res.status(401).send("Invalid password");
            return;
        }

        const token = generateToken(user);
        res.json({ token });

    } catch (error) {
        res.status(400).send("Error logging in user");
        return
    }
}

export const assignRole = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne(req.body.id);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        user.role = req.body.role as UserRole;
        await userRepository.save(user);

        res.json(user).send("Role assigned successfully " + user.email + " is now a " + user.role);

    }
    catch (error) {
        res.status(400).send("Error assigning role to user")
        return;
    }
}

//what other functions do we need to implement for authentication?

export const logout = async (req: Request, res: Response) => { }

export const forgotPassword = async (req: Request, res: Response) => { }

export const resetPassword = async (req: Request, res: Response) => { }

export const changePassword = async (req: Request, res: Response) => { }

export const verifyEmail = async (req: Request, res: Response) => { }

export const resendVerificationEmail = async (req: Request, res: Response) => { }

export const verifyPasswordReset = async (req: Request, res: Response) => { }

export const verifyEmailChange = async (req: Request, res: Response) => { }




