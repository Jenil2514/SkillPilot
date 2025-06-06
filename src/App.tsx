import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import CoursePage from "./pages/CoursePage";
import SocialFeed from "./pages/SocialFeed";
import CategoryPage from "./pages/CategoryPage";
import SavedCourses from "./pages/SavedCourses";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React from "react";

const queryClient = new QueryClient();

const App = () => {
  const { toast } = useToast();

  // Global Axios interceptor for 429 errors
  React.useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error?.response?.status === 429) {
          toast({
            title: "Too Many Requests",
            description: "You are sending requests too quickly. Please wait and try again.",
            // Optionally, you can add a variant or icon here
          });
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/course/:courseId" element={<CoursePage />} />
                <Route path="/community" element={<SocialFeed />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/saved-courses" element={<SavedCourses />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/contactUs" element={<ContactUs />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
