import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { getRepository, Timestamp } from "typeorm";
import { User } from "../models/user";


//Users
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

//Admin
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);

    try {
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        res.status(400).send("Error fetching users");
    }

}

//Admin
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

// export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
//     const userRepository = getRepository(User);
//     const userID = req.params.id;

//     try {
//         const users = await userRepository.findOne({ where: { id: userID } });
//         if (!users) {
//             return res.status(404).send("User not found");
//         }
//         userRepository.merge(users, req.body);
//         await userRepository.save(users);
//         res.json(users);
//     } catch (error) {
//         res.status(400).send("Error updating user");
//     }

// }


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userRepository = getRepository(User);
        const user = req.user!;
        const { email } = req.body;

        // Users can only update their own profile
        await userRepository.update(user.id, { email });
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }

}
};

export const getPublicData = async (req: Request, res: Response) => {
    res.json({ Message: "THis is the public data i guess", Timestamp: new Date() });
}


