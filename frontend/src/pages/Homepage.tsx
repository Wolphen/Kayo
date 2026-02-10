import "../assets/css/Homepage.css";
import PostCard from "../components/PostCard";
import { CURRENT_USER_ID, usePostsFeed } from "../hooks/usePostsFeed";

function Homepage() {
  const { sortedPosts, usersById, pendingLikePostId, isLoading, error, toggleLike } =
    usePostsFeed();
  const isEmpty = !isLoading && !error && sortedPosts.length === 0;

  return (
    <main className="homepage">
      {isLoading ? <p className="home-state">Chargement des posts...</p> : null}
      {error ? <p className="home-state home-state-error">{error}</p> : null}
      {isEmpty ? <p className="home-state">Aucun post pour le moment.</p> : null}
      <section className="home-grid">
        {sortedPosts.map((post) => (
            <>
                <PostCard
                    key={post.id}
                    imageUrl={post.imageUrl}
                    content={post.content}
                    createdAt={post.createdAt}
                    authorName={usersById[post.authorId]?.username ?? "Unknown user"}
                    likeCount={post.likes.length}
                    isLiked={post.likes.includes(CURRENT_USER_ID)}
                    onToggleLike={() => void toggleLike(post.id)}
                    likeDisabled={pendingLikePostId === post.id}
                    postId={post.id}
                    detailedComments={false}
                />
            </>
        ))}
      </section>
    </main>
  );
}

export default Homepage;
