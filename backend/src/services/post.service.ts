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
}
