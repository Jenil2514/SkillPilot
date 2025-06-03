
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryTabs from "@/components/CategoryTabs";
import FeaturedCourses from "@/components/FeaturedCourses";
import LearnersViewing from "@/components/LearnersViewing";
import TrustedCompanies from "@/components/TrustedCompanies";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CategoryTabs />
      <FeaturedCourses />
      <LearnersViewing />
      <TrustedCompanies />
      <Footer />
    </div>
  );
};

export default Index;
