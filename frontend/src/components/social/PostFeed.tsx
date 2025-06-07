import React, { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from './PostCard';
import axios from 'axios';
import { Post } from '../types/feedType';

const PAGE_SIZE = 10;

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/community`, {
        params: { page: pageNum, limit: PAGE_SIZE }
      });

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
          username: post.user?.username || '',
          avatar: post.user?.avatar || '',
        },
        content: post.content,
        timestamp: new Date(post.createdAt).toLocaleString(),
        likes: Array.isArray(post.likes) ? post.likes.length : 0,
        reposts: 0,
        comments: Array.isArray(post.comments) ? post.comments.length : 0,
        isLiked: false,
        isReposted: false,
      }));

      if (postsData.length < PAGE_SIZE) setHasMore(false);
      setPosts(prev => pageNum === 1 ? postsData : [...prev, ...postsData]);
    } catch (error) {
      console.log('API call failed:', error);
      if (pageNum === 1) setPosts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  useEffect(() => {
    if (loading) return;
    if (!hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    if (loaderRef.current) observer.current.observe(loaderRef.current);
  }, [loading, hasMore]);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {loading && (
        <div className="text-center">Loading posts...</div>
      )}
      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-500">No posts available</div>
      )}
      <div ref={loaderRef} />
      {!hasMore && posts.length > 0 && (
        <div className="text-center text-gray-400">No more posts</div>
      )}
    </div>
  );
};

export default PostFeed;
