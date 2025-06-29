import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { PostCardProps } from '../types/feedType';
import { toast } from '@/hooks/use-toast';

const PostCard = ({ post }: PostCardProps) => {
  const [likeCount, setLikeCount] = useState(Array.isArray(post.likes) ? post.likes.length : Number(post.likes) || 0);
  const [isLiked, setIsLiked] = useState(
    Array.isArray(post.likes) ? post.likes.includes(localStorage.getItem('userId') || '') : false
  );
  const [showComments, setShowComments] = useState(false);
  type Comment = {
    user?: {
      avatar?: string;
      name?: string;
    };
    text: string;
  };
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
  const navigate = useNavigate();

  // Helper to get liked posts from localStorage
  const getLikedPosts = () => {
    const liked = localStorage.getItem('likedPosts');
    return liked ? JSON.parse(liked) : [];
  };

  // On mount, check if this post is liked
  useEffect(() => {
    const likedPosts = getLikedPosts();
    setIsLiked(likedPosts.includes(post._id));
  }, [post._id]);

  // Fetch comments when showComments is toggled on
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
    // eslint-disable-next-line
  }, [showComments]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await axios.get(`${apiUrl}/api/community/${post._id}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
    setLoadingComments(false);
  };

  const handleLike = async () => {
    if (!token) {
      toast({
        title: 'Login required',
        description: 'Please login to like posts.',
      });
      setTimeout(() => navigate('/auth'), 1000);
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/community/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPost = response.data;
      setLikeCount(updatedPost.likes.length);

      // Update localStorage
      let likedPosts = getLikedPosts();
      if (!isLiked) {
        likedPosts.push(post._id);
      } else {
        likedPosts = likedPosts.filter((id: string) => id !== post._id);
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = () => {
    setShowComments((prev) => !prev);
  };

  const handleAddComment = async () => {
    if (!token) {
      toast({
        title: 'Login required',
        description: 'Please login to comment.',
      });
      setTimeout(() => navigate('/auth'), 1000);
      return;
    }
    if (!newComment.trim()) return;
    const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
    try {
      const response = await axios.post(
        `${apiUrl}/api/community/${post._id}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data.comments || []);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // const handleShare = () => {
  //   console.log('Share clicked for post:', post._id);
  // };

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
              <Link to={`/user/${post.user.id}`} className="font-semibold text-gray-900 dark:text-gray-300 hover:text-purple-600 transition-colors">
                {post.user.name}
              </Link>
              <span className="text-gray-500 dark:text-gray-300">@{post.user.name}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 dark:text-gray-300 text-sm">{post.timestamp}</span>
            </div>

            <p className="text-gray-800 leading-relaxed dark:text-gray-300">{post.content}</p>

            <div className="flex items-center pt-2 max-w-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {Array.isArray(post.comments) ? post.comments.length : post.comments}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`text-gray-500 hover:text-red-600 hover:bg-red-50 ${isLiked ? 'text-red-600' : ''}`}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likeCount}</span>
              </Button>

              {/* <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                <Share className="w-4 h-4" />
              </Button> */}
            </div>
          </div>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-4 border-t pt-2">
            {loadingComments ? (
              <div className="text-gray-500">Loading comments...</div>
            ) : (
              <>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {comments.length === 0 && (
                    <div className="text-gray-500 text-sm">No comments yet.</div>
                  )}
                  {comments.map((c, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={c.user?.avatar} alt={c.user?.name} />
                        <AvatarFallback>
                          {c.user?.name
                            ? c.user.name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .toUpperCase()
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-xs">{c.user?.name || 'User'}</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex mt-2 space-x-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PostCardSkeleton = () => (
  <Card className="animate-pulse mb-4">
    <CardContent className="flex space-x-3 p-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </CardContent>
  </Card>
);

// Optionally, you can use this skeleton in PostFeed or while loading comments/likes.

export default PostCard;
export { PostCardSkeleton };
