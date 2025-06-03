
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Skills that drive you forward
              </h2>
              <p className="text-gray-600 mb-6">
                Technology and the world of work change fast — with us, you're faster. Get the skills to achieve goals and stay competitive.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Learn now
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"
              alt="Team collaboration in modern office"
              className="rounded-lg shadow-xl w-full h-[400px] object-cover"
            />
            
            {/* Navigation Arrows */}
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
