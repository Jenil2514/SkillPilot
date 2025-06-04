
import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import axios from 'axios';

interface Post {
  id: number;
  user: {
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

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/social/posts');
        setPosts(response.data);
      } catch (error) {
        console.log('API call failed, using mock data:', error);
        // Mock data as fallback
        setPosts([
          {
            id: 1,
            user: {
              name: 'Sarah Chen',
              username: 'sarahcodes',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
            },
            content: 'Just completed my first React project! The journey from zero to building a functional web app has been incredible. Next up: learning TypeScript 🚀 #WebDevelopment #ReactJS',
            timestamp: '2h',
            likes: 24,
            reposts: 5,
            comments: 8,
            isLiked: false,
            isReposted: false
          },
          {
            id: 2,
            user: {
              name: 'Alex Rodriguez',
              username: 'alexlearns',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
            },
            content: 'Daily reminder: Consistency beats perfection. Been coding for 30 minutes every day for the past month. Small steps, big progress! 💪 #CodingJourney #ConsistencyIsKey',
            timestamp: '4h',
            likes: 67,
            reposts: 12,
            comments: 15,
            isLiked: true,
            isReposted: false
          },
          {
            id: 3,
            user: {
              name: 'Maria Garcia',
              username: 'mariadata',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
            },
            content: 'Struggling with machine learning concepts? I found that building projects while learning theory helps so much more than just reading textbooks. What\'s your learning style? #MachineLearning #DataScience',
            timestamp: '6h',
            likes: 45,
            reposts: 8,
            comments: 23,
            isLiked: false,
            isReposted: true
          },
          {
            id: 4,
            user: {
              name: 'David Kim',
              username: 'daviddesigns',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
            },
            content: 'UI/UX tip: Always design with accessibility in mind. Color contrast, keyboard navigation, and screen reader compatibility aren\'t afterthoughts - they\'re essentials! #UXDesign #Accessibility',
            timestamp: '8h',
            likes: 89,
            reposts: 31,
            comments: 19,
            isLiked: true,
            isReposted: false
          }
        ]);
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
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
