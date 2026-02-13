import { useEffect, useState } from "react";
import { Badge, Button, Card } from "flowbite-react";
import "../assets/css/profile.css";
import EditProfileModal from "../components/EditProfileModal";
import CreatePostModal from "../components/CreatePostComponent";
import { useAuth } from "../context/AuthContext";
import avatarPlaceholder from "../assets/avatar-placeholder.svg";

import PostCard from "../components/PostCard";

type ProfilPageProps = {
  userId?: string;
};

const getUserIdFromPath = () => {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] ?? "";
};

function ProfilPage({ userId }: ProfilPageProps) {
  const { user: authUser } = useAuth();
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
  const [isCreatePosts, setIsCreatePosts] = useState<boolean>(false);
  const [pendingLikePostId, setPendingLikePostId] = useState<string | null>(
    null,
  );

  const [posts, setPosts] = useState<
    {
      id: string;
      authorId: string;
      content: string;
      imageUrl: string;
      createdAt: string;
      likes: string[];
    }[]
  >([]);

  const currentUserId = authUser?.id ?? "";
  const resolvedUserId = userId || getUserIdFromPath() || authUser?.id || "";

  useEffect(() => {
    if (!resolvedUserId) {
      window.location.pathname = "/login";
      return;
    }
    const loadUser = async () => {
      try {
        setError("");
        setIsLoading(true);
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

  useEffect(() => {
    if (!resolvedUserId) return;
    const loadPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const allPosts = (await response.json()) as typeof posts;
        setPosts(allPosts.filter((post) => post.authorId === resolvedUserId));
      } catch (err) {
        setError((err as Error).message || "Failed to load posts");
      }
    };

    loadPosts();
  }, [resolvedUserId]);

  const joinedDate = user
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  const isOwnProfile = !!currentUserId && user?.id === currentUserId;
  const isFollowing =
    !!currentUserId && !!user?.followers?.includes(currentUserId);
  const canViewPosts = isOwnProfile || user?.isPublic || isFollowing;

  const toggleFollow = async () => {
    if (!user || isOwnProfile) return;
    if (!currentUserId) {
      setError("You must be logged in to follow users.");
      return;
    }
    try {
      setIsFollowSubmitting(true);
      setError("");
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: currentUserId }),
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

  const toggleLike = async (postId: string) => {
    if (!currentUserId) {
      setError("You must be logged in to like posts.");
      return;
    }
    if (pendingLikePostId) return;

    try {
      setPendingLikePostId(postId);
      setError("");
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/like`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const updatedPost = (await response.json()) as {
        id: string;
        authorId: string;
        content: string;
        imageUrl: string;
        createdAt: string;
        likes: string[];
      };

      setPosts((prev) =>
        prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
      );
    } catch (err) {
      setError((err as Error).message || "Failed to update like");
    } finally {
      setPendingLikePostId(null);
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
                  src={user.photoUrl || avatarPlaceholder}
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
                    <Button color="light" onClick={() => setIsEditOpen(true)}>
                      Edit profile
                    </Button>
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
            {isOwnProfile ? (
              <Button color="light" onClick={() => setIsCreatePosts(true)}>
                {/* Ouvre la modale de création de post */}
                New post
              </Button>
            ) : null}
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
              {posts
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((post) => (
                  <PostCard
                    key={post.id}
                    postId={post.id}
                    imageUrl={post.imageUrl}
                    content={post.content}
                    createdAt={post.createdAt}
                    authorName={user?.username}
                    authorId={user?.id}
                    likeCount={post.likes.length}
                    isLiked={post.likes.includes(currentUserId)}
                    onToggleLike={() => void toggleLike(post.id)}
                    likeDisabled={pendingLikePostId === post.id}
                  />
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
          initialPhotoUrl={user.photoUrl}
          onClose={() => setIsEditOpen(false)}
          onSaved={(updated) => {
            setUser((prev) => (prev ? { ...prev, ...updated } : prev));
            setIsEditOpen(false);
          }}
        />
      ) : null}
      {isCreatePosts && user ? (
        <CreatePostModal
          onClose={() => setIsCreatePosts(false)}
          onSaved={(newPost) => setPosts((prev) => [newPost, ...prev])}
        />
      ) : null}
    </main>
  );
}

export default ProfilPage;
