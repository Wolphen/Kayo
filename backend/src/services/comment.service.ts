import {CommentRepository} from "../repositories/comment.repository";
import {CreateCommentDto} from "../dtos/comment/create-comment.dto";


const repo = new CommentRepository();

export class CommentService {
    getCommentsByPostId(postId: string | string[]) {
        const comment = repo.findByPostId(postId);

        if (!comment) {
            throw new Error("No comments found");
        }

        return comment;
    }

    createComment(data: CreateCommentDto) {
        if (!data.content?.trim()) {
            throw new Error("Content is required");
        }

        return repo.create(data);
    }
}