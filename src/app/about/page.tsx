import AboutSection from "@/component/pages/about/aboutSection";
import CardSection from "@/component/pages/about/CardSection";
import Header from "@/component/pages/about/Header";
import ImageGrid from "@/component/pages/about/ImageGrid";
import LuxuryCarousel from "@/component/pages/about/luxuryCarousel";
import ExclusiveLuxurySection from "@/component/pages/home/ExclusiveLuxurySection";
import { Footer, FooterLayout } from "@/component/reusable/footer";
import Navbar from "@/component/reusable/navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <AboutSection />
      <LuxuryCarousel />
      <CardSection />
      <ImageGrid />
      <div className="py-20">
        <ExclusiveLuxurySection />
      </div>
      <FooterLayout />
    </div>
  );
};

export default page;
