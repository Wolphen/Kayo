import {comments} from "../data/comments.mock";
import {Comment} from "../data/type";
import {CreateCommentDto} from "../dtos/comment/create-comment.dto";
import {randomUUID} from "node:crypto";

export class CommentRepository{

    findByPostId(postId: string | string[]): Comment | undefined{
        return comments.find((comment) => comment.postId === postId);
    }

    create(data: CreateCommentDto): Comment | undefined{
        const newComment: Comment = {
            id: randomUUID(),
            postId: data.postId,
            authorId: data.authorId,
            content: data.content,
            createdAt: new Date(),
            modifiedAt: new Date(),
            likedBy: [],
        }

        comments.push(newComment);
        return newComment;
    }

    deleteById(id: string | string[]): Comment | undefined{
        const index = comments.findIndex((comment) => comment.id === id);
        if (index !== -1) {
            return comments.splice(index, 1)[0];
        }
        return undefined;
    }
}