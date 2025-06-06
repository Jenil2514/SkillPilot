import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {  Edit, Save, X } from 'lucide-react';
import axios from 'axios';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    profession: '', // <-- Changed from website to profession
    avatar: '',
    joinDate: '',
    stats: {
      coursesCompleted: 0,
      hoursLearned: 0,
      certificates: 0,
      currentStreak: 0
    }
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Or wherever you store your JWT
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Use environment variable or default to '/api'
        
        const response = await axios.get(`${apiUrl}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
        console.log('Profile data fetched:', response.data);
      } catch (error) {
        console.log('API call failed, using mock data:', error);
        setProfileData({
          name: 'John Doe',
          email: 'john.doe@example.com',
          bio: 'Passionate learner and technology enthusiast. Currently studying web development and machine learning.',
          location: 'San Francisco, CA',
          profession: 'Software Engineer', // <-- Changed from website to profession
          avatar: '',
          joinDate: 'January 2024',
          stats: {
            coursesCompleted: 12,
            hoursLearned: 156,
            certificates: 8,
            currentStreak: 15
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Update profile data
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      // Only send editable fields
      const { name, email, bio, location, profession } = profileData; // <-- Added email
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(
        `${apiUrl}/api/users/profile`,
        { name, email, bio, location, profession }, // <-- Added email
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
    } catch (error) {
      console.log('Failed to update profile:', error);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };




  // Helper function to get user initials safely
  const getUserInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'JD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <Avatar className="w-24 h-24 mx-auto">
                        {/* Only show initials, no image */}
                        <AvatarFallback className="text-4xl">
                          {getUserInitials(profileData.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <h2 className="text-xl font-bold mt-4 dark:text-gray-300">{profileData.name || 'User'}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{profileData.email}</p>
                    <p className="text-sm text-gray-500 mt-2 dark:text-gray-300">Member since {profileData.joinDate}</p>
                    
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 w-full"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6 ">
                <CardHeader>
                  <CardTitle>Learning Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Courses Completed</span>
                      <span className="font-semibold">{profileData.stats?.coursesCompleted ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Hours Learned</span>
                      <span className="font-semibold">{profileData.stats?.hoursLearned ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Certificates Earned</span>
                      <span className="font-semibold">{profileData.stats?.certificates ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Current Streak</span>
                      <span className="font-semibold">{profileData.stats?.currentStreak ?? 0} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Profile Information</CardTitle>
                      {isEditing && (
                        <div className="space-x-2">
                          <Button onClick={handleSave} size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button onClick={handleCancel} size="sm" variant="outline">
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profileData.location}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="profession">Profession</Label>
                          <Input
                            id="profession"
                            name="profession"
                            value={profileData.profession}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="courses">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Course history and progress will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements & Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Your achievements and certificates will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Account settings and preferences will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
