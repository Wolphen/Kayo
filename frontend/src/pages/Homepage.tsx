import { useMemo, useState } from "react";
import "../assets/css/Homepage.css";
import PostCard from "../components/PostCard";
import { usePostsFeed } from "../hooks/usePostsFeed";
import { useAuth } from "../context/AuthContext";

function Homepage() {
  const { logout } = useAuth();
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const {
    sortedPosts,
    usersById,
    followingIds,
    currentUserId,
    pendingLikePostId,
    isLoading,
    error,
    toggleLike,
  } = usePostsFeed();

  const displayedPosts = useMemo(() => {
    if (!showFollowingOnly) {
      return sortedPosts;
    }
    return sortedPosts.filter((post) => followingIds.includes(post.authorId));
  }, [showFollowingOnly, sortedPosts, followingIds]);

  const isEmpty = !isLoading && !error && displayedPosts.length === 0;

  return (
    <main className="homepage">
      <header className="home-header">
        <div className="home-brand">
          <div className="home-logo">K</div>
          <div>
            <h1>Kayo</h1>
            <button className="home-logout" onClick={logout} type="button">
              Déconnexion
            </button>
          </div>
        </div>
        <a className="home-profile" href="/profil" aria-label="Profil">
          <svg
            className="home-profile-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profil
        </a>
      </header>
      <div className="home-filter-row">
        <button
          type="button"
          className={`home-filter-btn ${showFollowingOnly ? "active" : ""}`}
          onClick={() => setShowFollowingOnly((prev) => !prev)}
        >
          {showFollowingOnly ? "Posts suivis" : "Tous les posts"}
        </button>
      </div>
      {isLoading ? <p className="home-state">Chargement des posts...</p> : null}
      {error ? <p className="home-state home-state-error">{error}</p> : null}
      {isEmpty ? (
        <p className="home-state">
          {showFollowingOnly
            ? "Aucun post des personnes que tu suis."
            : "Aucun post pour le moment."}
        </p>
      ) : null}
      <section className="home-grid">
        {displayedPosts.map((post) => (
          <PostCard
            key={post.id}
            postId={post.id}
            imageUrl={post.imageUrl}
            content={post.content}
            createdAt={post.createdAt}
            authorName={usersById[post.authorId]?.username ?? "Unknown user"}
            authorId={post.authorId}
            likeCount={post.likes.length}
            isLiked={post.likes.includes(currentUserId)}
            onToggleLike={() => void toggleLike(post.id)}
            likeDisabled={pendingLikePostId === post.id}
            detailedComments={false}
          />
        ))}
      </section>
    </main>
  );
}

export default Homepage;
