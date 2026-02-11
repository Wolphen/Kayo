import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "flowbite-react";
import "../assets/css/Homepage.css";
import PostCard from "../components/PostCard";
import { usePostsFeed } from "../hooks/usePostsFeed";
import { useAuth } from "../context/AuthContext";

const INITIAL_POSTS_COUNT = 3;
const LOAD_MORE_COUNT = 3;
const LOAD_DELAY_MS = 2000;

function Homepage() {
  const { logout } = useAuth();
  const {
    sortedPosts,
    usersById,
    currentUserId,
    pendingLikePostId,
    isLoading,
    error,
    toggleLike,
  } = usePostsFeed();
  const [visiblePostsCount, setVisiblePostsCount] =
    useState<number>(INITIAL_POSTS_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreTimerRef = useRef<number | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisiblePostsCount(INITIAL_POSTS_COUNT);
  }, [sortedPosts]);

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current !== null) {
        window.clearTimeout(loadMoreTimerRef.current);
      }
    };
  }, []);

  const visiblePosts = sortedPosts.slice(
    0,
    Math.min(visiblePostsCount, sortedPosts.length),
  );
  const hasMorePosts = sortedPosts.length > visiblePostsCount;
  const isEmpty = !isLoading && !error && sortedPosts.length === 0;

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMorePosts) return;
    setIsLoadingMore(true);
    loadMoreTimerRef.current = window.setTimeout(() => {
      setVisiblePostsCount((prev) => prev + LOAD_MORE_COUNT);
      setIsLoadingMore(false);
      loadMoreTimerRef.current = null;
    }, LOAD_DELAY_MS);
  }, [hasMorePosts, isLoadingMore]);

  useEffect(() => {
    const node = loadMoreTriggerRef.current;
    if (!node || isLoading || !hasMorePosts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          handleLoadMore();
        }
      },
      { root: null, rootMargin: "180px 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMorePosts, isLoading]);

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
      {isLoading ? <p className="home-state">Chargement des posts...</p> : null}
      {error ? <p className="home-state home-state-error">{error}</p> : null}
      {isEmpty ? (
        <p className="home-state">Aucun post pour le moment.</p>
      ) : null}
      <section className="home-grid">
        {visiblePosts.map((post) => (
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
      {!isLoading && sortedPosts.length > INITIAL_POSTS_COUNT ? (
        <div className="home-load-more">
          {hasMorePosts ? (
            <div ref={loadMoreTriggerRef} className="home-load-more-trigger" />
          ) : null}
          {isLoadingMore ? (
            <p className="home-load-more-status">
              <Spinner size="sm" className="me-2" />
              Chargement...
            </p>
          ) : null}
          <p className="home-load-more-meta"></p>
        </div>
      ) : null}
    </main>
  );
}

export default Homepage;
