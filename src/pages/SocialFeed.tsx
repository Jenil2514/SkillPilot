import React from 'react';
import Header from '@/components/Header';
import PostComposer from '@/components/social/PostComposer';
import PostFeed from '@/components/social/PostFeed';
import authService from '@/services/authService'; // Add this import

const SocialFeed = () => {
  const isLoggedIn = authService.isAuthenticated(); // Check authentication

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {isLoggedIn && <PostComposer />} {/* Only show if logged in */}
          <PostFeed />
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;
