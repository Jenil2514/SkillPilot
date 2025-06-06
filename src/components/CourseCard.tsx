import { Star, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import axios from "axios";

interface CourseCardProps {
  courseId: string;
  title: string;
  view: number;
  image: string;
  badge?: string;
  initiallyBookmarked?: boolean;
  onBookmarkToggle?: (courseId: string, currentlyBookmarked: boolean) => void; // Add this
}

const CourseCard = ({
  courseId,
  title,
  view,
  image,
  badge,
  initiallyBookmarked = false,
  onBookmarkToggle,
}: CourseCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked);
  const [loading, setLoading] = useState(false);

  // Sync with parent prop if it changes
  useEffect(() => {
    setIsBookmarked(initiallyBookmarked);
  }, [initiallyBookmarked]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_BACKEND_URI;
    const url = isBookmarked
      ? `${apiUrl}/api/users/unsave/${courseId}`
      : `${apiUrl}/api/users/save/${courseId}`;
    const method = isBookmarked ? "delete" : "post";
    // console.log("full URL:", url);
    try {
      await axios({
        url,
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsBookmarked(!isBookmarked);
      if (onBookmarkToggle) {
        await onBookmarkToggle(courseId, isBookmarked);
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to update bookmark"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/course/${courseId}`} className="block">
      <div className="bg-background rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-t-lg aspect-[4/3]"
          />
          {badge && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
              {badge}
            </span>
          )}
          <button
            onClick={handleBookmark}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            disabled={loading}
          >
            <Bookmark
              className={`h-4 w-4 ${
                isBookmarked ? "fill-purple-600 text-purple-600" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex justify-between items-center">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-300 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {title}
            </h3>
          </div>
          <div className="flex items-center ml-4">
            <Users className="h-4 w-4 mr-1" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {view > 1000 ? "1K+" : view}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
