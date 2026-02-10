import { useState } from "react";
import { Button, Card, ToggleSwitch } from "flowbite-react";

type EditProfileModalProps = {
  userId: string;
  initialEmail: string;
  initialUsername: string;
  initialBio: string;
  initialIsPublic: boolean;
  initialPhotoUrl: string;
  onClose: () => void;
  onSaved: (user: {
    id: string;
    email: string;
    username: string;
    bio: string;
    isPublic: boolean;
    photoUrl: string;
  }) => void;
};

function EditProfileModal({
  userId,
  initialEmail,
  initialUsername,
  initialBio,
  initialIsPublic,
  initialPhotoUrl,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const [email, setEmail] = useState<string>(initialEmail);
  const [username, setUsername] = useState<string>(initialUsername);
  const [bio, setBio] = useState<string>(initialBio);
  const [isPublic, setIsPublic] = useState<boolean>(initialIsPublic);
  const [photoUrl, setPhotoUrl] = useState<string>(initialPhotoUrl);
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      setError("");
      setIsSaving(true);
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim(),
          bio: bio.trim(),
          isPublic,
          photoUrl: photoUrl.trim(),
        }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message || "Failed to update profile");
      }
      const updated = (await response.json()) as {
        id: string;
        email: string;
        username: string;
        bio: string;
        isPublic: boolean;
        photoUrl: string;
      };
      onSaved(updated);
    } catch (err) {
      setError((err as Error).message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <Card className="modal-card">
        <div className="modal-header">
          <h3>Edit profile</h3>
          <button className="modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label htmlFor="edit-username">Username</label>
            <input
              id="edit-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label htmlFor="edit-email">Email</label>
            <input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label htmlFor="edit-bio">Bio</label>
            <textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={100}
              rows={3}
            />
            <span className="modal-helper">{bio.length}/100</span>
          </div>
          <div className="modal-field">
            <label htmlFor="edit-photo">Photo URL</label>
            <input
              id="edit-photo"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="modal-toggle">
            <ToggleSwitch
              checked={isPublic}
              label={isPublic ? "Public profile" : "Private profile"}
              onChange={setIsPublic}
            />
          </div>
          {error ? <p className="modal-error">{error}</p> : null}
        </div>
        <div className="modal-actions">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default EditProfileModal;
