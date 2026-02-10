import { PostRepository } from "../repositories/post.repository";

const repo = new PostRepository();

export class PostService {
    getPosts() {
        return repo.findAll();
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
}
