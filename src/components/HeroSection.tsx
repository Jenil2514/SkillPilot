import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=600&fit=crop"
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const prevImage = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="bg-background p-6 rounded-lg shadow-lg shadow-color max-w-md">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Skills that drive you forward
              </h2>
              <p className="text-foreground mb-6">
                Technology and the world of work change fast — with us, you're faster. Get the skills to achieve goals and stay competitive.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Learn now
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image Carousel */}
          <div className="relative">
            <img
              src={images[current]}
              alt="Team collaboration in modern office"
              className="rounded-lg shadow-xl w-full h-[400px] object-cover"
            />

            {/* Navigation Arrows */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    idx === current ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrent(idx)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
