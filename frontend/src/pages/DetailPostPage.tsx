import "../assets/css/DetailPostPage.css";
import CommentsComponent from "../components/CommentsComponent.tsx";
import { usePostDetail } from "../hooks/usePostDetail";


type DetailPostPageProps = {
  postId: string;
};

function DetailPostPage({ postId }: DetailPostPageProps) {
  const { post, author, currentUserId, formattedDate, goToProfile, isLoading, isLikePending, error, toggleLike } =
    usePostDetail(postId);

  const handleDelete = async () => {
    if (!post) return;
    if (!currentUserId) return;
    if (currentUserId !== post.authorId) return;

    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer ce post ?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:3001/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error("Échec de la suppression du post");
      }

      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err) {
      alert((err as Error).message || "Échec de la suppression du post");
    }
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
              {author?.username ?? "Utilisateur inconnu"}
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

              {currentUserId && post.authorId === currentUserId ? (
                <button type="button" className="detail-post-delete-btn" onClick={handleDelete}>
                  Supprimer
                </button>
              ) : null}

            </div>
            <CommentsComponent postId={post.id} details={true} />
          </div>
        </article>
      ) : null}
    </main>
  );
}

export default DetailPostPage;
