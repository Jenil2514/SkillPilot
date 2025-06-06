export interface Post {
  _id: string;
  user: {
    id?: string;
    name: string;
    username?: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  comments: number;
  isLiked: boolean;
  isReposted: boolean;
}

export interface PostCardProps {
  post: Post;
}