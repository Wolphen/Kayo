import api from "./api";
import type { Comment } from "../types/Type";

type UserPreview = {
  id: string;
  username: string;
};

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const res = await api.get<Comment[]>(`/comments/${postId}`);
  return res.data;
}

export async function getLastCommentByPostId(postId: string): Promise<Comment> {
    const res = await api.get<Comment>(`/comments/${postId}/last`);
    return res.data;
}

export async function createComment(postId: string, authorId: string, content: string): Promise<Comment> {
  const res = await api.post<Comment>(`/comments`, {
    postId,
    authorId,
    content
  });
  return res.data;
}

export async function deleteComment(commentId: string): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/comments/${commentId}`);
  return res.data;
}

export async function getUserById(userId: string): Promise<UserPreview> {
  const res = await api.get<UserPreview>(`/users/${userId}`);
  return res.data;
}

