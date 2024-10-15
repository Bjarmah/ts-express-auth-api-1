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

}