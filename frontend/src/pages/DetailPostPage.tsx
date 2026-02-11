import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../assets/css/DetailPostPage.css";
import { useAuth } from "../context/AuthContext";
import CommentsComponent from "../components/CommentsComponent.tsx";

type DetailPostPageProps = {
  postId: string;
};

type Post = {
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

function DetailPostPage({ postId }: DetailPostPageProps) {
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

  return (
    <main className="detail-post-page">
      {isLoading ? <p className="detail-post-state">Chargement...</p> : null}
      {error ? <p className="detail-post-state detail-post-state-error">{error}</p> : null}
      {!isLoading && !error && post ? (
        <article className="detail-post-shell">
          <img className="detail-post-image" src={post.imageUrl} alt={post.content} />
          <div className="detail-post-body">
            <button type="button" className="detail-post-author-btn" onClick={goToProfile}>
              {author?.username ?? "Unknown user"}
            </button>
            <p className="detail-post-content">{post.content}</p>
            <p className="detail-post-date">{formattedDate}</p>
            <div className="detail-post-footer">
              <span className="detail-post-like-count">{post.likes.length}</span>
              <button
                type="button"
                className={`detail-post-like-btn ${
                  post.likes.includes(currentUserId) ? "liked" : ""
                }`}
                onClick={() => void toggleLike()}
                disabled={isLikePending}
                aria-label="Like post"
              >
                <svg viewBox="0 0 24 24" className="detail-post-like-icon" aria-hidden="true">
                  <path d="M12 21s-6.7-4.35-9.33-8.03C.58 10.03 1.43 5.5 5.36 4.5 7.63 3.93 9.8 4.8 12 7.07c2.2-2.27 4.37-3.14 6.64-2.57 3.93 1 4.78 5.53 2.69 8.47C18.7 16.65 12 21 12 21Z" />
                </svg>
              </button>
            </div>
            <CommentsComponent postId={post.id} details={true} />
          </div>
        </article>
      ) : null}
    </main>
  );
}

export default DetailPostPage;
