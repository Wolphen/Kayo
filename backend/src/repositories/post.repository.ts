import { posts } from "../data/posts.mock";
import { Post } from "../data/type";
import { randomUUID } from "node:crypto";

export class PostRepository {
    findAll(): Post[] {
        return posts;
    }

    findById(id: string | string[]): Post | undefined {
        return posts.find((post) => post.id === id);
    }

    create(data: { authorId: string; content: string; imageUrl?: string }): Post {
        const newPost: Post = {
            id: randomUUID(),
            authorId: data.authorId,
            content: data.content,
            imageUrl: data.imageUrl ?? "",
            createdAt: new Date(),
            modifiedAt: new Date(),
            likes: [],
        };

        posts.unshift(newPost);
        return newPost;
    }

    toggleLike(postId: string | string[], userId: string): Post {
        const post = this.findById(postId); 

        if (!post) {
            throw new Error("Post not found");
        }

        const alreadyLiked = post.likes.includes(userId); // Verifie si l'utilisateur a deja aime le post

        if (alreadyLiked) {
            post.likes = post.likes.filter((id) => id !== userId); // Si oui, on le retire de la liste des likes
        } else {
            post.likes.push(userId); // Sinon, on l'ajoute a la liste des likes
        }
        return post;
    }

    deleteById(id: string | string[]): Post | undefined {
        const targetId = Array.isArray(id) ? id[0] : id;
        const index = posts.findIndex((p) => p.id === targetId);
        if (index === -1) return undefined;
        return posts.splice(index, 1)[0];
    }
}
