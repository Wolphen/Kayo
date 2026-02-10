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
}
