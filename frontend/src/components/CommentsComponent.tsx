import "../assets/css/comments.css";
import { useEffect, useState } from "react";
import { getCommentsByPostId, getLastCommentByPostId, createComment, deleteComment, getUserById } from "../lib/comments.api";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../types/Type";

type UserPreview = {
  id: string;
  username: string;
};

function CommentsComponent(props: { postId: string, details?: boolean }) {
  const { postId, details } = props;
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usersById, setUsersById] = useState<Record<string, UserPreview>>({});

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        let commentsData: Comment[];
        if (details === false) {
          const last = await getLastCommentByPostId(postId);
          commentsData = last ? [last] : [];
        } else {
          commentsData = await getCommentsByPostId(postId);
        }
        setComments(commentsData);

        const authorIds = Array.from(new Set(commentsData.map(c => c.authorId)));
        const users = await Promise.all(
          authorIds.map(async (authorId) => {
            try {
              console.log("authorId", authorId);
              return await getUserById(authorId);
            } catch {
              console.log("erreur")
              return { id: authorId, username: authorId };
            }
          })
        );

        const userMap: Record<string, UserPreview> = {};
        users.forEach(u => {
          userMap[u.id] = u;
        });
        setUsersById(userMap);
      } catch (err: unknown) {
        const getErrorMessage = (e: unknown) => {
          if (!e) return "Failed to load comments";
          if (typeof e === "string") return e;
          if (e instanceof Error) return e.message;
          type AxiosLike = { response?: { data?: { message?: string } }; message?: string };
          const ae = e as AxiosLike;
          return ae.response?.data?.message ?? ae.message ?? "Failed to load comments";
        };

        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, details]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCommentContent.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const newComment = await createComment(postId, user.id, newCommentContent);

      try {
        const userPreview = await getUserById(newComment.authorId);
        setUsersById(prev => ({ ...prev, [userPreview.id]: userPreview }));
      } catch {
        setUsersById(prev => ({ ...prev, [newComment.authorId]: { id: newComment.authorId, username: newComment.authorId } }));
      }

      setComments(prev => prev ? [...prev, newComment] : [newComment]);
      setNewCommentContent("");
    } catch (err: unknown) {
      const getErrorMessage = (e: unknown) => {
        if (!e) return "Failed to create comment";
        if (typeof e === "string") return e;
        if (e instanceof Error) return e.message;
        type AxiosLike = { response?: { data?: { message?: string } }; message?: string };
        const ae = e as AxiosLike;
        return ae.response?.data?.message ?? ae.message ?? "Failed to create comment";
      };
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    try {
      await deleteComment(commentId);
      setComments(prev => prev ? prev.filter(c => c.id !== commentId) : null);
    } catch (err: unknown) {
      const getErrorMessage = (e: unknown) => {
        if (!e) return "Failed to delete comment";
        if (typeof e === "string") return e;
        if (e instanceof Error) return e.message;
        type AxiosLike = { response?: { data?: { message?: string } }; message?: string };
        const ae = e as AxiosLike;
        return ae.response?.data?.message ?? ae.message ?? "Failed to delete comment";
      };
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return <div className="comments">Chargement des commentaires...</div>;
  }

  if (error) {
    return <div className="comments error">Erreur lors du chargement des commentaires: {error}</div>;
  }

  return (
    <div className="comments" onClick={(e) => e.stopPropagation()}>
      {details && user && (
        <form onSubmit={handleSubmitComment} className="comment-form" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Ajouter un commentaire..."
            disabled={isSubmitting}
            className="comment-textarea"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newCommentContent.trim()}
            className="comment-submit-btn"
          >
            {isSubmitting ? "Publication en cours..." : "Publier"}
          </button>
        </form>
      )}

      {!comments || comments.length === 0 ? (
        <div className="no-comments">No comments yet.</div>
      ) : (
        comments.map((c) => {
          const isOwnComment = user?.id === c.authorId;
          const authorName = usersById[c.authorId]?.username ?? c.authorId;
          return (
            <div key={c.id} className="comment">
              <div className="comment-body">
                <p className="comment-author">{authorName}</p>
                <p className="comment-content">{c.content}</p>
                <p className="comment-date">{new Date(c.createdAt).toLocaleString()}</p>
                {(isOwnComment && details) && (
                  <button
                    onClick={() => {
                      handleDeleteComment(c.id);
                    }}
                    className="comment-delete-btn"
                  >
                    supprimer
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default CommentsComponent;