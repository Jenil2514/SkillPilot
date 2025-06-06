import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import axios from 'axios';
import { Post } from '../types/feedType';





const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Adjust base URL as needed
        const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/community`);
        // Map backend posts to frontend Post interface
        type BackendPost = {
          _id: string;
          user?: {
            _id?: string;
            name?: string;
            username?: string;
            avatar?: string;
          };
          content: string;
          createdAt: string;
          likes?: unknown[];
          comments?: unknown[];
        };

        const postsData: Post[] = (response.data || []).map((post: BackendPost) => ({
          _id: post._id,
          user: {
            id: post.user?._id,
            name: post.user?.name || 'Unknown',
            // Add username/avatar if available in your user model
            username: post.user?.username || '',
            avatar: post.user?.avatar || '',
          },
          content: post.content,
          timestamp: new Date(post.createdAt).toLocaleString(),
          likes: Array.isArray(post.likes) ? post.likes.length : 0,
          reposts: 0, // Not implemented in backend yet
          comments: Array.isArray(post.comments) ? post.comments.length : 0,
          isLiked: false, // You can set this based on current user
          isReposted: false, // Not implemented in backend yet
        }));
        setPosts(postsData);
      } catch (error) {
        console.log('API call failed, using mock data:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.isArray(posts) && posts.map((post) => (
        
        <PostCard key={post._id} post={post} />
      ))}
      {(!Array.isArray(posts) || posts.length === 0) && (
        <div className="text-center text-gray-500">No posts available</div>
      )}
    </div>
  );
};

export default PostFeed;
