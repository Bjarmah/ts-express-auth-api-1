import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User, UserRole } from "../models/user";
import bycrpt from "bcrypt";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
    //Note the reques contains the email and password of the user
    try {

        const userRepository = getRepository(User); // Get the user repository
        const newUser = userRepository.create(req.body); // Create a new user and save in the newUser variable
        await userRepository.save(newUser); // Save the new user to database
        res.json(userRepository).send("User created successfully: " + newUser);
    } catch (error) {
        res.status(400).send(error + "\nUser not created, Error Registering user");
    }

}

export const login = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);

    try {
        const user = await userRepository.findOne({ where: req.body.email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const valid = await bycrpt.compare(req.body.passorod, user.password);

        if (!valid) {
            return res.status(401).send("Invalid password");
        }

        const token = generateToken(user);
        res.json({ token });

    } catch (error) {
        return res.status(400).send("Error logging in user");
    }
}