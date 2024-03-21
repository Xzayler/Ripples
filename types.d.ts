type Ripple = {
  // retweetedBy: string | null; once retweets are implemented
  authorName: string;
  authorHandle: string;
  pfp: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  likes: number;
  reposts: number;
  comments: number;
};
