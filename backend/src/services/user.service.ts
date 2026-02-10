import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import argon2 from "argon2";

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

  async createUser(data: CreateUserDto) {
    const username = data.username?.trim();
    const email = data.email?.trim().toLowerCase();

    if (!username) {
      throw new Error("Username is required");
    }

    if (!email) {
      throw new Error("Email is required");
    }

    if (!data.password || data.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const existingEmail = repo.findByEmail(email);
    if (existingEmail) {
      throw new Error("Email already used");
    }

    const existingUsername = repo.findByUsername(username);
    if (existingUsername) {
      throw new Error("Username already used");
    }

    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
    });

    return repo.create({
      ...data,
      email,
      username,
      password: hashedPassword,
    });
  }
}
