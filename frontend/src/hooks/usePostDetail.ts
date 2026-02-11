import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import type { Post } from "./usePostsFeed";

type UserPreview = {
  id: string;
  username: string;
};

const POSTS_API_URL = "http://localhost:3001/posts";
const USERS_API_URL = "http://localhost:3001/users";

export function usePostDetail(postId: string) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? "";
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<UserPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikePending, setIsLikePending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setError("");
        setIsLoading(true);

        const postResponse = await axios.get<Post>(`${POSTS_API_URL}/${postId}`);
        setPost(postResponse.data);

        const userResponse = await axios.get<UserPreview>(
          `${USERS_API_URL}/${postResponse.data.authorId}`,
        );
        setAuthor(userResponse.data);
      } catch {
        setError("Impossible de charger ce post.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPost();
  }, [postId]);

  const toggleLike = async () => {
    if (!post || isLikePending) return;
    if (!currentUserId) {
      setError("You must be logged in to like posts.");
      return;
    }

    setIsLikePending(true);
    try {
      const response = await axios.put<Post>(`${POSTS_API_URL}/${post.id}/like`, {
        userId: currentUserId,
      });
      setPost(response.data);
    } catch {
      setError("Impossible de mettre a jour le like.");
    } finally {
      setIsLikePending(false);
    }
  };

  const formattedDate = useMemo(() => {
    if (!post) return "";
    return new Date(post.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [post]);

  const goToProfile = () => {
    if (!post?.authorId) return;
    window.history.pushState({}, "", `/profil/${post.authorId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return {
    post,
    author,
    currentUserId,
    formattedDate,
    goToProfile,
    isLoading,
    isLikePending,
    error,
    toggleLike,
  };
}
