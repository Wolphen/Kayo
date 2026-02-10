import { useMemo, useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/Homepage.css";

type Post = {
  id: string;
  authorId: string;
  imageUrl: string;
  content: string;
  createdAt: string;
  modifiedAt: string;
  likes: string[];
};

const API_URL = "http://localhost:3001/posts";
const USERS_API_URL = "http://localhost:3001/users";
const CURRENT_USER_ID = "u1";

type UserPreview = {
  id: string;
  username: string;
};

function Homepage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [usersById, setUsersById] = useState<Record<string, UserPreview>>({});
  const [pendingLikePostId, setPendingLikePostId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>(API_URL);
        setPosts(response.data);

        const authorIds = Array.from(new Set(response.data.map((post) => post.authorId)));
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
        setUsersById(userMap);
      } catch {
        setError("Impossible de charger les posts.");
      }
    };

    void fetchPosts();
  }, []);

  const toggleLike = async (postId: string) => { 
    if (pendingLikePostId) return; 

    setPendingLikePostId(postId); // Empêche les clics rapides

    try {
      const response = await axios.put<Post>(`${API_URL}/${postId}/like`, {  // Envoie une requête PUT avec toutes les infos pour toggler le like
        userId: CURRENT_USER_ID,
      });

      setPosts((prevPosts) => // Met à jour le post dans la liste avec les nouvelles données du serveur
        prevPosts.map((post) => (post.id === postId ? response.data : post)),
      );
    } catch (error) {
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

  const formatDate = (dateIso: string) =>
    new Date(dateIso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <main className="homepage">
      {error ? <p>{error}</p> : null}
      <section className="home-grid">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-neutral-primary-soft block max-w-sm border border-default rounded-base shadow-xs home-card"
          >
            <a href="#">
              <img className="rounded-t-base home-card-image" src={post.imageUrl} alt={post.content} />
            </a>
            <div className="p-6 home-card-body">
              <p className="home-card-author">{usersById[post.authorId]?.username ?? "Unknown user"}</p>
              <p className="home-card-description">{post.content}</p>
              <p className="home-card-date">{formatDate(post.createdAt)}</p>
              <div className="home-card-footer">
                <span className="home-like-count">{post.likes.length}</span>
                <button
                  type="button"
                  className={`home-like-icon-btn ${
                    post.likes.includes(CURRENT_USER_ID) ? "liked" : ""
                  }`}
                  onClick={() => void toggleLike(post.id)}
                  aria-label="Like post"
                  disabled={pendingLikePostId === post.id}
                >
                  <svg viewBox="0 0 24 24" className="home-like-icon" aria-hidden="true">
                    <path d="M12 21s-6.7-4.35-9.33-8.03C.58 10.03 1.43 5.5 5.36 4.5 7.63 3.93 9.8 4.8 12 7.07c2.2-2.27 4.37-3.14 6.64-2.57 3.93 1 4.78 5.53 2.69 8.47C18.7 16.65 12 21 12 21Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Homepage;
