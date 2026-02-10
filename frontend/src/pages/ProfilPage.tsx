import { useEffect, useState } from "react";
import { Badge, Button, Card } from "flowbite-react";
import "../assets/css/profile.css";
import EditProfileModal from "../components/EditProfileModal";

type ProfilPageProps = {
  userId?: string;
};

// TODO(auth): replace this with the authenticated user's id from the token/session.
const CURRENT_USER_ID = "u1";

const getUserIdFromPath = () => {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] ?? "";
};

function ProfilPage({ userId }: ProfilPageProps) {
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
  const [isFollowSubmitting, setIsFollowSubmitting] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const mockPostsByUser: Record<
    string,
    {
      id: string;
      content: string;
      imageUrl: string;
      createdAt: string;
      likes: number;
      comments: number;
    }[]
  > = {
    u1: [
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
      {
        id: "p31",
        content: "Wireframing the new onboarding flow.",
        imageUrl: "https://picsum.photos/seed/p31/900/500",
        createdAt: "2025-11-02T08:45:00.000Z",
        likes: 17,
        comments: 5,
      },
      {
        id: "p32",
        content: "Sketching hero illustrations for the landing.",
        imageUrl: "https://picsum.photos/seed/p32/900/500",
        createdAt: "2025-11-08T16:20:00.000Z",
        likes: 23,
        comments: 4,
      },
      {
        id: "p33",
        content: "Polishing micro-interactions in the settings page.",
        imageUrl: "https://picsum.photos/seed/p33/900/500",
        createdAt: "2025-11-15T13:10:00.000Z",
        likes: 31,
        comments: 8,
      },
    ],
    u2: [
      {
        id: "p2",
        content: "Shipped a refactor and cleaned tech debt.",
        imageUrl: "https://picsum.photos/seed/p2/900/500",
        createdAt: "2025-10-02T10:15:00.000Z",
        likes: 21,
        comments: 4,
      },
      {
        id: "p12",
        content: "API latency down after caching tweaks.",
        imageUrl: "https://picsum.photos/seed/p12/900/500",
        createdAt: "2025-10-13T11:30:00.000Z",
        likes: 18,
        comments: 2,
      },
    ],
    u3: [
      {
        id: "p3",
        content: "Morning light in the market alley.",
        imageUrl: "https://picsum.photos/seed/p3/900/500",
        createdAt: "2025-10-04T06:30:00.000Z",
        likes: 34,
        comments: 6,
      },
    ],
  };

  const resolvedUserId = userId || getUserIdFromPath() || CURRENT_USER_ID;
  const posts = mockPostsByUser[resolvedUserId] ?? [];

  useEffect(() => {
    const loadUser = async () => {
      try {
        setError("");
        setIsLoading(true);
        // TODO(auth): include the access token in Authorization headers.
        const response = await fetch("http://localhost:3001/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = (await response.json()) as (typeof user)[];
        const currentUser =
          users.find((u) => u?.id === resolvedUserId) ?? users[0];
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
  }, [resolvedUserId]);

  const joinedDate = user
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  const isOwnProfile = user?.id === CURRENT_USER_ID;
  const isFollowing = !!user?.followers?.includes(CURRENT_USER_ID);
  const canViewPosts = isOwnProfile || user?.isPublic || isFollowing;

  const toggleFollow = async () => {
    if (!user || isOwnProfile) return;
    try {
      setIsFollowSubmitting(true);
      setError("");
      const endpoint = isFollowing ? "unfollow" : "follow";
      // TODO(auth): include the access token in Authorization headers.
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: CURRENT_USER_ID }),
        },
      );
      if (!response.ok) {
        throw new Error(
          isFollowing ? "Failed to unfollow user" : "Failed to follow user",
        );
      }
      const result = (await response.json()) as {
        follower: typeof user;
        target: typeof user;
      };
      setUser(result.target);
    } catch (err) {
      setError((err as Error).message || "Failed to update follow status");
    } finally {
      setIsFollowSubmitting(false);
    }
  };

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
                  {isOwnProfile ? (
                    <>
                      <Button color="light" onClick={() => setIsEditOpen(true)}>
                        Edit profile
                      </Button>
                    </>
                  ) : (
                    <Button
                      color={isFollowing ? "gray" : "blue"}
                      onClick={toggleFollow}
                      disabled={isFollowSubmitting}
                    >
                      {isFollowSubmitting
                        ? isFollowing
                          ? "Unfollowing..."
                          : "Following..."
                        : isFollowing
                          ? "Following"
                          : "Follow"}
                    </Button>
                  )}
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
              <h2>{isOwnProfile ? "My posts" : "Posts"}</h2>
              <p>
                {isOwnProfile
                  ? "Latest activity from your profile."
                  : "Latest activity from this profile."}
              </p>
            </div>
            {isOwnProfile ? <Button color="light">New post</Button> : null}
          </div>

          {!canViewPosts ? (
            <Card className="post-card">
              <div className="post-body">
                <p className="post-content">This profile is private.</p>
                <p className="post-date">
                  Follow this user to see their posts.
                </p>
              </div>
            </Card>
          ) : (
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
          )}
        </section>
      </div>
      {isEditOpen && user ? (
        <EditProfileModal
          userId={user.id}
          initialEmail={user.email}
          initialUsername={user.username}
          initialBio={user.bio}
          initialIsPublic={user.isPublic}
          onClose={() => setIsEditOpen(false)}
          onSaved={(updated) => {
            setUser((prev) => (prev ? { ...prev, ...updated } : prev));
            setIsEditOpen(false);
          }}
        />
      ) : null}
    </main>
  );
}

export default ProfilPage;
