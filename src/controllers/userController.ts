import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user";



export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const userID = req.user?.id;

    try {
        const users = await userRepository.findOne({ where: { id: userID } });
        if (!users) {
            return res.status(404).send("User not found");
        }
        res.json({ user: { id: users.id, email: users.email, role: users.role } });
    } catch (error) {
        res.status(400).send("Error fetching users");
    }

}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);

    try {
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        res.status(400).send("Error fetching users");
    }

}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const userID = req.user?.id;

    try {
        const users = await userRepository.findOne({ where: { id: userID } });
        if (!users) {
            return res.status(404).send("User not found");
        }
        await userRepository.remove(users);
        res.json("User deleted successfully");
    } catch (error) {
        res.status(400).send("Error deleting user");
    }


}

export const getPublicData = async (req: Request, res: Response) => {
    res.json({ Message: "THis is the public data i guess" })
}

