import { PostRepository } from "../repositories/post.repository";
import { CreatePostDto } from "../dtos/post/create-post.dto";

const repo = new PostRepository();

export class PostService {
    getPosts() {
        return repo.findAll();
    }

    createPost(authorId: string, data: CreatePostDto) {
        if (!authorId?.trim()) {
            throw new Error("authorId is required");
        }

        if (!data.content?.trim()) {
            throw new Error("Content is required");
        }

        return repo.create({
            authorId,
            content: data.content.trim(),
            imageUrl: data.imageUrl?.trim() ?? "",
        });
    }
    getPostById(postId: string | string[]) {
        const post = repo.findById(postId);

        if (!post) {
            throw new Error("Post not found");
        }

        return post;
    }

    toggleLike(postId: string | string[], userId: string) {
        if (!userId?.trim()) { 
            throw new Error("userId is required");
        }

        return repo.toggleLike(postId, userId);
    }

    deletePost(postId: string | string[], requesterId: string, requesterIsAdmin = false) {
        const targetId = Array.isArray(postId) ? postId[0] : postId;
        const post = repo.findById(targetId);
        if (!post) {
            throw new Error("Post not found");
        }

        if (!requesterIsAdmin && post.authorId !== requesterId) {
            throw new Error("Not authorized to delete this post");
        }

        return repo.deleteById(targetId);
    }
}

