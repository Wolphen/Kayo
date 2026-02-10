export type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  photoUrl: string;
  bio: string;
  followers: string[];
  following: string[];
  isPublic: boolean;
  createdAt: Date;
  modifiedAt: Date;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  likedBy: string[];
};

export type Post = {
  id: string;
  authorId: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  modifiedAt: Date;
  likes: string[];
};