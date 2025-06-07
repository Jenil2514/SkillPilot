import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PostComposer = () => {
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (postContent.trim()) {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';

      const token = localStorage.getItem('token');
      try {
        await axios.post(
          `${apiUrl}/api/community/createpost`,
          { content: postContent },
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        setPostContent('');
      } catch (error) {
        console.error('Failed to post:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage src="https://png.pngtree.com/png-vector/20241101/ourlarge/pngtree-thinking-emoji-with-pensive-expression-representing-deep-png-image_14213837.png" />
            <AvatarFallback>{}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening in your learning journey?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="border-none resize-none text-lg placeholder:text-gray-400 focus-visible:ring-0"
              rows={3}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {280 - postContent.length} characters remaining
              </div>
              <Button
                onClick={handlePost}
                disabled={!postContent.trim() || postContent.length > 280 || loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostComposer;
