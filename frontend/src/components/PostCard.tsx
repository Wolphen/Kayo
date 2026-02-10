import "../assets/css/PostCard.css";

type PostCardProps = {
  postId: string;
  imageUrl: string;
  content: string;
  createdAt: string;
  authorName?: string;
  authorId?: string;
  likeCount: number;
  isLiked?: boolean;
  onToggleLike?: () => void;
  likeDisabled?: boolean;
};

function PostCard({
  postId,
  imageUrl,
  content,
  createdAt,
  authorName,
  authorId,
  likeCount,
  isLiked = false,
  onToggleLike,
  likeDisabled = false,
}: PostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const goToDetailPost = () => {
    window.history.pushState({}, "", `/detailPost/${postId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const goToProfile = () => {
    if (!authorId) return;
    window.history.pushState({}, "", `/profil/${authorId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <article
      className="feed-post-card"
      role="link"
      tabIndex={0}
      onClick={goToDetailPost}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToDetailPost();
        }
      }}
    >
      <a
        href={`/detailPost/${postId}`}
        onClick={(event) => {
          event.preventDefault();
          goToDetailPost();
        }}
      >
        <img
          className="feed-post-image"
          src={imageUrl}
          alt={content}
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="feed-post-body">
        {authorName ? (
          <button
            type="button"
            className="feed-post-author-btn"
            onClick={(event) => {
              event.stopPropagation();
              goToProfile();
            }}
            disabled={!authorId}
          >
            {authorName}
          </button>
        ) : null}
        <p className="feed-post-description">{content}</p>
        <p className="feed-post-date">{formattedDate}</p>
        <div className="feed-post-footer">
          <span className="feed-post-like-count">{likeCount}</span>
          <button
            type="button"
            className={`feed-post-like-btn ${isLiked ? "liked" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleLike?.();
            }}
            disabled={likeDisabled || !onToggleLike}
            aria-label="Like post"
          >
            <svg viewBox="0 0 24 24" className="feed-post-like-icon" aria-hidden="true">
              <path d="M12 21s-6.7-4.35-9.33-8.03C.58 10.03 1.43 5.5 5.36 4.5 7.63 3.93 9.8 4.8 12 7.07c2.2-2.27 4.37-3.14 6.64-2.57 3.93 1 4.78 5.53 2.69 8.47C18.7 16.65 12 21 12 21Z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
