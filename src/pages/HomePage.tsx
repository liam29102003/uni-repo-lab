import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HeroSection from '@/components/HomePage/HeroSection';
import FeaturedProjects from '@/components/HomePage/FeaturedProjects';
import PartnerUniversities from '@/components/HomePage/PartnerUniversities';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {/* <FeaturedProjects />
        <PartnerUniversities /> */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;