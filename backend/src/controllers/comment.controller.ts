import {CommentService} from "../services/comment.service";


const service = new CommentService()

export const getCommentsByPostId = (req: any, res: any) => {
    const comments = service.getCommentsByPostId(req.params.postId);
    res.status(200).json(comments);
};

export const getLastCommentByPostId = (req: any, res: any) => {
    const comment = service.getLastCommentByPostId(req.params.postId);
    res.status(200).json(comment);
};

export const createComment = (req: any, res: any) => {
    try {
        const comment = service.createComment(req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const deleteComment = (req: any, res: any) => {
    try {
        const result = service.deleteComment(req.params.commentId);
        res.status(201).json(result);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
}