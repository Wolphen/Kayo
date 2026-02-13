import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { AuthRequest } from "../middleware/auth.middleware";

const service = new PostService();

export const getPosts = (req: Request, res: Response) => {
    res.json(service.getPosts());
};

export const createPost = (req: AuthRequest, res: Response) => {
    try {
        // Récupère l'utilisateur connecté via son token traité dans la middleware
        const authorId = req.user?.sub ?? "";
        const post = service.createPost(authorId, req.body);
        // Renvoi la réponse du post au front
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}
export const getPost = (req: Request, res: Response) => {
    try {
        const post = service.getPostById(req.params.id);
        res.json(post);
    } catch (error) {
        const message = (error as Error).message;
        const status = message === "Post not found" ? 404 : 400;
        res.status(status).json({ message });
    }
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
