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

        const existingUser = repo.findByEmail(data.email);

        if (existingUser) {
            throw new Error("Email already used");
        }

        return repo.create(data);
    }
}
