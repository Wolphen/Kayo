import { useState } from "react";
import axios from "axios";
import { Button, Card } from "flowbite-react";
import { useAuth } from "../context/AuthContext";

type CreatePostModalProps = {
  onClose: () => void;
  onSaved: (post: {
    id: string;
    authorId: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    modifiedAt: string;
    likes: string[];
  }) => void;
};

function CreatePostComponent({ onClose, onSaved }: CreatePostModalProps) {

  const { token } = useAuth();

  const [content, setContent] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState("");
 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    // Empêche le chargement de la page à la soumission
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Missing token. Please login.");
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/posts",
        {
          content: content.trim(),
          imageUrl: imageUrl.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSaved(response.data);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(message || "Failed to create post.");
      } else {
        setError("Failed to create post.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <Card className="modal-card">
        <div className="modal-header">
          <h3>New post</h3>
          <button className="modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-field">
            <label htmlFor="postContent">Contenu</label>
            <textarea
              id="postContent"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              placeholder="Ecris ton post..."
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="postImage">Image (url optionnelle)</label>
            <input
              id="postImage"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
            />
          </div>
          {error ? <p className="modal-error">{error}</p> : null}
          <div className="modal-actions">
            <Button color="gray" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creation..." : "Publier"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreatePostComponent;
