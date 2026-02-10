import { Request, Response } from "express";
import { PostService } from "../services/post.service";

const service = new PostService();

export const getPosts = (req: Request, res: Response) => {
    res.json(service.getPosts());
};

export const togglePostLike = (req: Request, res: Response) => {
    try {
        const post = service.toggleLike(req.params.id, req.body?.userId);
        res.json(post);
    } catch (error) {
        const message = (error as Error).message;
        const status = message === "Post not found" ? 404 : 400;
        res.status(status).json({ message });
    }
};
