import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "flowbite-react";
import "../assets/css/Homepage.css";
import PostCard from "../components/PostCard";
import { usePostsFeed } from "../hooks/usePostsFeed";

const INITIAL_POSTS_COUNT = 3;
const LOAD_MORE_COUNT = 3;
const LOAD_DELAY_MS = 2000;

function Homepage() {
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const {
    sortedPosts,
    usersById,
    followingIds,
    currentUserId,
    currentUserIsAdmin,
    pendingLikePostId,
    isLoading,
    error,
    toggleLike,
    deletePost,
  } = usePostsFeed();
  const [visiblePostsCount, setVisiblePostsCount] =
    useState<number>(INITIAL_POSTS_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreTimerRef = useRef<number | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisiblePostsCount(INITIAL_POSTS_COUNT);
  }, [sortedPosts, showFollowingOnly]);

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current !== null) {
        window.clearTimeout(loadMoreTimerRef.current);
      }
    };
  }, []);

  const displayedPosts = useMemo(() => {
    if (!showFollowingOnly) {
      return sortedPosts;
    }
    return sortedPosts.filter((post) => followingIds.includes(post.authorId));
  }, [showFollowingOnly, sortedPosts, followingIds]);

  const visiblePosts = displayedPosts.slice(
    0,
    Math.min(visiblePostsCount, displayedPosts.length),
  );
  const hasMorePosts = displayedPosts.length > visiblePostsCount;
  const isEmpty = !isLoading && !error && displayedPosts.length === 0;

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
      {isEmpty ? <p className="home-state">Aucun post pour le moment.</p> : null}
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
            canDelete={Boolean(currentUserId) && (currentUserId === post.authorId || currentUserIsAdmin)}
            onDelete={() => void deletePost(post.id)}
            detailedComments={false}
          />
        ))}
      </section>
      {!isLoading && displayedPosts.length > INITIAL_POSTS_COUNT ? (
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
          <p className="home-load-more-meta">
            {visiblePosts.length} / {displayedPosts.length} posts affiches
          </p>
        </div>
      ) : null}
    </main>
  );
}

export default Homepage;
