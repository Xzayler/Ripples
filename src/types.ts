export type Ripple = {
  // retweetedBy: string | null; once retweets are implemented
  id: string;
  authorName: string;
  authorHandle: string;
  pfp: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  likes: number;
  hasLiked: boolean;
  hasBookmarked: boolean;
  reposts: number;
  comments: number;
  ancestors?: Ripple[];
  children?: Ripple[];
};

export type User = {
  id: string;
  name: string;
  handle: string;
  pfp?: string;
  bio: string;
  followers: number;
  following: number;
};
