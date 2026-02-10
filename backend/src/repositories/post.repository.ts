import { posts } from "../data/posts.mock";
import { Post } from "../data/type";

export class PostRepository {
    findAll(): Post[] {
        return posts;
    }

    findById(id: string | string[]): Post | undefined {
        return posts.find((post) => post.id === id);
    }

    toggleLike(postId: string | string[], userId: string): Post {
        const post = this.findById(postId); 

        if (!post) {
            throw new Error("Post not found");
        }

        const alreadyLiked = post.likes.includes(userId); // Vérifie si l'utilisateur a déjà aimé le post

        if (alreadyLiked) {
            post.likes = post.likes.filter((id) => id !== userId); // Si oui, on le retire de la liste des likes
        } else {
            post.likes.push(userId); // Sinon, on l'ajoute à la liste des likes
        }
        return post;
    }
}
