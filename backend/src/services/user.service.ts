import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dtos/user/create-user.dto";

const repo = new UserRepository();

export class UserService {
    getUsers() {
        return repo.findAll();
    }

    getUserById(id: string | string[]) {
        const user = repo.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    createUser(data: CreateUserDto) {
        if (!data.username?.trim()) {
            throw new Error("Username is required");
        }

        if (!data.email?.trim()) {
            throw new Error("Email is required");
        }

        if (!data.password || data.password.length < 8) {
            throw new Error("Password must be at least 8 characters");
        }

        const existingUser = repo.findByEmail(data.email);

        if (existingUser) {
            throw new Error("Email already used");
        }

        return repo.create(data);
    }
}
