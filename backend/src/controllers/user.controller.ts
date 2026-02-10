import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const service = new UserService();

export const getUsers = (req: Request, res: Response) => {
    res.json(service.getUsers());
};

export const getUser = (req: Request, res: Response) => {
    try {
        const user = service.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await service.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const followUser = (req: Request, res: Response) => {
    try {
        const followerId = req.body?.followerId;
        const targetId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const result = service.followUser(followerId, targetId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const unfollowUser = (req: Request, res: Response) => {
    try {
        const followerId = req.body?.followerId;
        const targetId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const result = service.unfollowUser(followerId, targetId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};
