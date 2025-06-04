
import React from 'react';
import Header from '@/components/Header';
import PostComposer from '@/components/social/PostComposer';
import PostFeed from '@/components/social/PostFeed';

const SocialFeed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <PostComposer />
          <PostFeed />
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;
