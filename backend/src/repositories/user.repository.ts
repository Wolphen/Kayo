import { users } from "../data/users.mock";
import { User } from "../data/type";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { randomUUID } from "node:crypto";

export class UserRepository {
    findAll(): User[] {
        return users;
    }

    findById(id: string | string[]): User | undefined {
        return users.find((user) => user.id === id);
    }

    findByEmail(email: string): User | undefined {
        return users.find((user) => user.email === email);
    }

    findByUsername(username: string): User | undefined {
        return users.find((user) => user.username === username);
    }

    create(data: CreateUserDto): User {
        const newUser: User = {
            id: randomUUID(),
            email: data.email,
            username: data.username,
            password: data.password, // hash later
            isAdmin: false,
            photoUrl: "",
            bio: "",
            followers: [],
            following: [],
            isPublic: data.isPublic ?? true,
            createdAt: new Date(),
            modifiedAt: new Date(),
        };

        users.push(newUser);
        return newUser;
    }

    update(
        user: User,
        updates: Partial<
            Pick<User, "email" | "username" | "bio" | "isPublic" | "photoUrl">
        >,
    ): User {
        if (updates.email !== undefined) {
            user.email = updates.email;
        }
        if (updates.username !== undefined) {
            user.username = updates.username;
        }
        if (updates.bio !== undefined) {
            user.bio = updates.bio;
        }
        if (updates.isPublic !== undefined) {
            user.isPublic = updates.isPublic;
        }
        if (updates.photoUrl !== undefined) {
            user.photoUrl = updates.photoUrl;
        }
        user.modifiedAt = new Date();
        return user;
    }
}
