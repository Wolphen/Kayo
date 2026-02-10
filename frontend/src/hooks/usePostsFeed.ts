import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export type Post = {
  id: string;
  authorId: string;
  imageUrl: string;
  content: string;
  createdAt: string;
  modifiedAt: string;
  likes: string[];
};

type UserPreview = {
  id: string;
  username: string;
};

const POSTS_API_URL = "http://localhost:3001/posts";
const USERS_API_URL = "http://localhost:3001/users";

export function usePostsFeed() {
  const { user } = useAuth();
  const currentUserId = user?.id ?? "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [usersById, setUsersById] = useState<Record<string, UserPreview>>({});
  const [pendingLikePostId, setPendingLikePostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await axios.get<Post[]>(POSTS_API_URL);
        const nextPosts = response.data;

        const authorIds = Array.from(new Set(nextPosts.map((post) => post.authorId)));
        const users = await Promise.all(
          authorIds.map(async (authorId) => {
            const userResponse = await axios.get<UserPreview>(`${USERS_API_URL}/${authorId}`);
            return userResponse.data;
          }),
        );

        const userMap: Record<string, UserPreview> = {};
        users.forEach((user) => {
          userMap[user.id] = user;
        });

        setPosts(nextPosts);
        setUsersById(userMap);
      } catch {
        setError("Impossible de charger les posts.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPostsAndUsers();
  }, []);

  const toggleLike = async (postId: string) => {
    if (!currentUserId) {
      setError("You must be logged in to like posts.");
      return;
    }
    if (pendingLikePostId) return;

    setPendingLikePostId(postId);
    try {
      const response = await axios.put<Post>(`${POSTS_API_URL}/${postId}/like`, {
        userId: currentUserId,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? response.data : post)),
      );
    } catch {
      setError("Impossible de mettre a jour le like.");
    } finally {
      setPendingLikePostId(null);
    }
  };

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [posts],
  );

  return {
    sortedPosts,
    usersById,
    currentUserId,
    pendingLikePostId,
    isLoading,
    error,
    toggleLike,
  };
}
