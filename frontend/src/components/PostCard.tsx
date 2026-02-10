import "../assets/css/PostCard.css";
import CommentsComponent from "./CommentsComponent.tsx";

type PostCardProps = {
  imageUrl: string;
  content: string;
  createdAt: string;
  authorName?: string;
  likeCount: number;
  isLiked?: boolean;
  onToggleLike?: () => void;
  likeDisabled?: boolean;
  postId: string;
    detailedComments?: boolean;
};

function PostCard({
  imageUrl,
  content,
  createdAt,
  authorName,
  likeCount,
  isLiked = false,
  onToggleLike,
  likeDisabled = false, postId, detailedComments = false
}: PostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <article className="feed-post-card">
      <a href="#">
        <img
          className="feed-post-image"
          src={imageUrl}
          alt={content}
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="feed-post-body">
        {authorName ? <p className="feed-post-author">{authorName}</p> : null}
        <p className="feed-post-description">{content}</p>
        <p className="feed-post-date">{formattedDate}</p>
        <div className="feed-post-footer">
          <span className="feed-post-like-count">{likeCount}</span>
          <button
            type="button"
            className={`feed-post-like-btn ${isLiked ? "liked" : ""}`}
            onClick={onToggleLike}
            disabled={likeDisabled || !onToggleLike}
            aria-label="Like post"
          >
            <svg viewBox="0 0 24 24" className="feed-post-like-icon" aria-hidden="true">
              <path d="M12 21s-6.7-4.35-9.33-8.03C.58 10.03 1.43 5.5 5.36 4.5 7.63 3.93 9.8 4.8 12 7.07c2.2-2.27 4.37-3.14 6.64-2.57 3.93 1 4.78 5.53 2.69 8.47C18.7 16.65 12 21 12 21Z" />
            </svg>
          </button>
        </div>
        <CommentsComponent postId={postId} details={detailedComments} />
      </div>
    </article>
  );
}

export default PostCard;
