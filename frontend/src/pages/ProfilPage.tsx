import { useEffect, useState } from "react";
import { Badge, Button, Card } from "flowbite-react";
import "../assets/css/profile.css";

function ProfilPage() {
  const [user, setUser] = useState<null | {
    id: string;
    email: string;
    username: string;
    isAdmin: boolean;
    photoUrl: string;
    bio: string;
    followers: string[];
    following: string[];
    isPublic: boolean;
    createdAt: string;
    modifiedAt: string;
  }>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const posts = [
    {
      id: "p1",
      content: "Prototype day. Pushed a new nav flow.",
      imageUrl: "https://picsum.photos/seed/p1/900/500",
      createdAt: "2025-10-01T09:00:00.000Z",
      likes: 12,
      comments: 3,
    },
    {
      id: "p11",
      content: "Design system update: new spacing scale.",
      imageUrl: "https://picsum.photos/seed/p11/900/500",
      createdAt: "2025-10-12T10:40:00.000Z",
      likes: 28,
      comments: 7,
    },
    {
      id: "p21",
      content: "Testing a softer brand voice for onboarding.",
      imageUrl: "https://picsum.photos/seed/p21/900/500",
      createdAt: "2025-10-28T12:05:00.000Z",
      likes: 9,
      comments: 1,
    },
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await fetch("http://localhost:3001/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = (await response.json()) as (typeof user)[];
        const currentUser = users.find((u) => u?.id === "u1") ?? users[0];
        if (!currentUser) {
          throw new Error("No users found");
        }
        setUser(currentUser);
      } catch (err) {
        setError((err as Error).message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const joinedDate = user
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <main className="profile-page">
      <div className="profile-shell">
        {isLoading ? <p>Loading profile...</p> : null}
        {error ? <p>{error}</p> : null}
        {!isLoading && !error && user ? (
          <section className="profile-hero">
            <div className="profile-banner" />
            <Card className="profile-card">
              <div className="profile-top">
                <img
                  className="profile-avatar"
                  src={user.photoUrl}
                  alt={`${user.username} avatar`}
                />
                <div className="profile-main">
                  <div className="profile-title">
                    <h1>{user.username}</h1>
                    <div className="profile-badges">
                      <Badge color={user.isPublic ? "success" : "gray"}>
                        {user.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-bio">{user.bio}</p>
                  <p className="profile-meta">Joined {joinedDate}</p>
                </div>
                <div className="profile-actions">
                  <Button color="light">Edit profile</Button>
                  <Button color="gray">Settings</Button>
                </div>
              </div>
              <div className="profile-stats">
                <div>
                  <span className="stat-value">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div>
                  <span className="stat-value">{user.followers.length}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div>
                  <span className="stat-value">{user.following.length}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </Card>
          </section>
        ) : null}

        <section className="profile-posts">
          <div className="section-header">
            <div>
              <h2>My posts</h2>
              <p>Latest activity from your profile.</p>
            </div>
            <Button color="light">New post</Button>
          </div>
          <div className="post-grid">
            {posts.map((post) => (
              <Card key={post.id} className="post-card">
                <img
                  className="post-image"
                  src={post.imageUrl}
                  alt="Post illustration"
                />
                <div className="post-body">
                  <p className="post-date">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="post-content">{post.content}</p>
                  <div className="post-footer">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProfilPage;
