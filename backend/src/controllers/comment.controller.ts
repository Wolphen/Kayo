import {CommentService} from "../services/comment.service";


const service = new CommentService()

export const getCommentsByPostId = (req: any, res: any) => {
    try {
        const comments = service.getCommentsByPostId(req.params.postId);
        res.json(comments);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

export const createComment = (req: any, res: any) => {
    try {
        const comment = service.createComment(req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};