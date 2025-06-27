import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Globe, Calendar } from 'lucide-react';
import api from '@/services/api';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  stats: {
    coursesCompleted: number;
    hoursLearned: number;
    certificates: number;
    currentStreak: number;
  };
}

// Skeleton Loader for UserProfile
const UserProfileSkeleton = () => (
  <div className="flex justify-center items-center min-h-screen bg-background animate-pulse">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-4 mx-auto" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-2 mx-auto" />
      <div className="h-4 bg-gray-100 rounded w-1/3 mb-2 mx-auto" />
      <div className="h-4 bg-gray-100 rounded w-1/4 mb-2 mx-auto" />
    </div>
  </div>
);

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError('User ID not provided');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await api.get(`${apiUrl}/api/users/profile/${userId}`);
        setUserProfile(response.data);
      } catch (error: any) {
        console.log('Failed to fetch user profile:', error);
        setError('User not found or an error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const getUserInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) return <UserProfileSkeleton />;

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
            <p className="text-gray-600">{error || 'This user profile does not exist.'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto">
                      {/* Only show AvatarImage if userProfile.image exists */}
                      {/* {userProfile.image && (
                        <AvatarImage src={userProfile.image} alt={userProfile.name} />
                      )} */}
                      <AvatarFallback className="text-2xl">
                        {getUserInitials(userProfile.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h2 className="text-xl font-bold mt-4">{userProfile.name}</h2>
                    <p className="text-gray-600">{userProfile.email}</p>
                    
                    {userProfile.location && (
                      <div className="flex items-center justify-center mt-2 text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{userProfile.location}</span>
                      </div>
                    )}
                    
                    {userProfile.website && (
                      <div className="flex items-center justify-center mt-1 text-gray-500">
                        <Globe className="w-4 h-4 mr-1" />
                        <a 
                          href={userProfile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center mt-2 text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">Joined {userProfile.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Learning Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courses Completed</span>
                      <span className="font-semibold">{userProfile.stats.coursesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours Learned</span>
                      <span className="font-semibold">{userProfile.stats.hoursLearned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificates Earned</span>
                      <span className="font-semibold">{userProfile.stats.certificates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Streak</span>
                      <span className="font-semibold">{userProfile.stats.currentStreak} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {userProfile.bio ? (
                    <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">This user hasn't added a bio yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No recent activity to display.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
