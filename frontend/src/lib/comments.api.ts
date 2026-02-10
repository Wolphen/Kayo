import api from "./api";
import type { Comment } from "../types/Type";

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const res = await api.get<Comment[]>(`/comments/${postId}`);
  console.log(res);
  return res.data;
}

export async function getLastCommentByPostId(postId: string): Promise<Comment> {
    const res = await api.get<Comment>(`/comments/${postId}/last`);
    console.log(res);
    return res.data;
}
