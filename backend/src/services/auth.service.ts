import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

const repo = new UserRepository();

export class AuthService {
    async login(email: string, password: string) {
        if (!email?.trim()) {
            throw new Error("Email is required");
        }

        if (!password) {
            throw new Error("Password is required");
        }

        const user = repo.findByEmail(email.trim());

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const storedPassword = user.password ?? "";
        const isHashed = storedPassword.startsWith("$argon2");
        const isValid = isHashed
            ? await argon2.verify(storedPassword, password)
            : storedPassword === password;

        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const userPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            photoUrl: user.photoUrl,
            bio: user.bio,
            isPublic: user.isPublic,
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not set");
        }

        const token = jwt.sign(
            { sub: user.id, email: user.email, isAdmin: user.isAdmin },
            secret,
            { expiresIn: "1h" }
        );

        return { user: userPayload, token };
    }
}
