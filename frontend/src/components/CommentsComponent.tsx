import "../assets/css/comments.css";
import { useEffect, useState } from "react";
import { getCommentsByPostId, getLastCommentByPostId } from "../lib/comments.api";
import type { Comment } from "../types/Type";

function CommentsComponent(props: { postId: string, details?: boolean }) {
  const { postId, details } = props;
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        if (details === false) {
          const last = await getLastCommentByPostId(postId);
          setComments(last ? [last] : []);
        } else {
          const data = await getCommentsByPostId(postId);
          setComments(data);
        }
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

    fetchComments().then(r => console.log(r));
  }, [postId, details]);

  if (loading) {
    return <div className="comments">Loading comments...</div>;
  }

  if (error) {
    return <div className="comments error">Error loading comments: {error}</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="comments">No comments yet.</div>;
  }

  return (
    <div className="comments">
      {comments.map((c) => {
        return (
          <div key={c.id} className="comment">
            <div className="comment-body">
              <p className="comment-author">{c.authorId}</p>
              <p className="comment-content">{c.content}</p>
              <p className="comment-date">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CommentsComponent;