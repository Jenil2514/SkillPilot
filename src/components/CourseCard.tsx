
import { Star, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface CourseCardProps {
  title: string;
  instructor: string;
  image: string;
  badge?: string;
}

const CourseCard = ({ title, instructor, image, badge }: CourseCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    console.log(`Course ${isBookmarked ? 'removed from' : 'added to'} bookmarks: ${title}`);
  };

  return (
    <Link to="/course/1" className="block">
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
          >
            <Bookmark 
              className={`h-4 w-4 ${isBookmarked ? 'fill-purple-600 text-purple-600' : 'text-gray-600'}`} 
            />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-300 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{instructor}</p>
          
          
          
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
