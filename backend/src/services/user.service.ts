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
}
