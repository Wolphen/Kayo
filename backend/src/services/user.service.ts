import argon2 from "argon2";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { createHash } from "node:crypto";

const repo = new UserRepository();

const hashPassword = async (password: string) => {
  try {
    const argon2 = await import("argon2");
    return argon2.hash(password, { type: argon2.argon2id });
  } catch {
    return createHash("sha256").update(password).digest("hex");
  }
};

export class UserService {
  getUsers() {
    return repo.findAll();
  }

  getUserById(id: string | string[]) {
    console.log("Fetching user with id:", id);
    const user = repo.findById(id);
    console.log(user);
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

    const hashedPassword = await hashPassword(data.password);
    const isAdmin = email.includes("@admin");

    return repo.create({
      email,
      username,
      password: hashedPassword,
      isPublic: data.isPublic,
      isAdmin,
    });
  }

  followUser(followerId: string, targetId: string) {
    if (!followerId || !targetId) {
      throw new Error("Follower and target are required");
    }

    if (followerId === targetId) {
      throw new Error("You cannot follow yourself");
    }

    const follower = repo.findById(followerId);
    if (!follower) {
      throw new Error("Follower not found");
    }

    const target = repo.findById(targetId);
    if (!target) {
      throw new Error("Target user not found");
    }

    if (!follower.following.includes(targetId)) {
      follower.following.push(targetId);
    }

    if (!target.followers.includes(followerId)) {
      target.followers.push(followerId);
    }

    follower.modifiedAt = new Date();
    target.modifiedAt = new Date();

    return { follower, target };
  }

  unfollowUser(followerId: string, targetId: string) {
    if (!followerId || !targetId) {
      throw new Error("Follower and target are required");
    }

    if (followerId === targetId) {
      throw new Error("You cannot unfollow yourself");
    }

    const follower = repo.findById(followerId);
    if (!follower) {
      throw new Error("Follower not found");
    }

    const target = repo.findById(targetId);
    if (!target) {
      throw new Error("Target user not found");
    }

    follower.following = follower.following.filter((id) => id !== targetId);
    target.followers = target.followers.filter((id) => id !== followerId);

    follower.modifiedAt = new Date();
    target.modifiedAt = new Date();

    return { follower, target };
  }

  updateUser(
    id: string,
    data: {
      email?: string;
      username?: string;
      bio?: string;
      isPublic?: boolean;
      photoUrl?: string;
    },
  ) {
    const user = repo.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const email = data.email?.trim().toLowerCase();
    const username = data.username?.trim();
    const bio = data.bio?.trim();
    const isPublic =
      typeof data.isPublic === "boolean" ? data.isPublic : undefined;
    const photoUrl = data.photoUrl?.trim();

    if (email) {
      const existingEmail = repo.findByEmail(email);
      if (existingEmail && existingEmail.id !== id) {
        throw new Error("Email already used");
      }
    }

    if (username) {
      const existingUsername = repo.findByUsername(username);
      if (existingUsername && existingUsername.id !== id) {
        throw new Error("Username already used");
      }
    }

    return repo.update(user, {
      email: email ?? user.email,
      username: username ?? user.username,
      bio: bio ?? user.bio,
      isPublic: isPublic ?? user.isPublic,
      photoUrl: photoUrl ?? user.photoUrl,
    });
  }
}

