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

    deleteComment(commentId: string | string[]) {
        try{
            const deletedComment = repo.deleteById(commentId);

            if (!deletedComment) {
                throw new Error("Comment not found");
            }

            return { message: "Comment deleted successfully", comment: deletedComment };
        } catch(err) {
            throw new Error((err as Error).message || "Failed to delete comment");
        }
    }
}