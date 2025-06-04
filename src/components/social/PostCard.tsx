
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

interface Post {
  id: number;
  user: {
    id?: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  comments: number;
  isLiked: boolean;
  isReposted: boolean;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const handleLike = () => {
    // TODO: Implement like functionality
    console.log('Like clicked for post:', post.id);
  };

  const handleRepost = () => {
    // TODO: Implement repost functionality
    console.log('Repost clicked for post:', post.id);
  };

  const handleComment = () => {
    // TODO: Implement comment functionality
    console.log('Comment clicked for post:', post.id);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share clicked for post:', post.id);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex space-x-3">
          <Link to={post.user.id ? `/user/${post.user.id}` : '#'} className="flex-shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{getUserInitials(post.user.name)}</AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <Link 
                to={post.user.id ? `/user/${post.user.id}` : '#'} 
                className="font-semibold text-gray-900 dark:text-gray-300 hover:text-purple-600 transition-colors"
              >
                {post.user.name}
              </Link>
              <Link 
                to={post.user.id ? `/user/${post.user.id}` : '#'} 
                className="text-gray-500 dark:text-gray-300 hover:text-purple-600 transition-colors"
              >
                @{post.user.username}
              </Link>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 dark:text-gray-300 text-sm">{post.timestamp}</span>
            </div>
            
            <p className="text-gray-800 leading-relaxed dark:text-gray-300">{post.content}</p>
            
            <div className="flex items-center  pt-2 max-w-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="text-gray-500  hover:text-blue-600 hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{post.comments}</span>
              </Button>
              
              
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`text-gray-500 hover:text-red-600 hover:bg-red-50 ${
                  post.isLiked ? 'text-red-600' : ''
                }`}
              >
                <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 "
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
