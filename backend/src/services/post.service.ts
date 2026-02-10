import { PostRepository } from "../repositories/post.repository";

const repo = new PostRepository();

export class PostService {
    getPosts() {
        return repo.findAll();
    }

    toggleLike(postId: string | string[], userId: string) {
        if (!userId?.trim()) { 
            throw new Error("userId is required");
        }

        return repo.toggleLike(postId, userId);
    }
}
