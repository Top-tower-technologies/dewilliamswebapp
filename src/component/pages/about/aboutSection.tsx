// components/HeroSection.tsx

import lobby from "../../../../public/bg/about/carousel1.png";
import Image from "next/image";
import IntroSection from "./IntroSection";

export default function AboutSection() {
  return (
    <section className="gap-8 px-6 py-12 items-center">
      {/* Left Side */}
      <IntroSection />

      {/* Right Side (Image) */}
      <div className="relative p-6 px-20">
        <Image
          src={lobby} // Replace with your image path
          alt="Lounge"
          width={400}
          height={400}
          className="rounded-lg shadow-md object-cover w-full h-[500px]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 bg-white bg-opacity-70 rounded-full flex items-center justify-center hover:scale-105 transition">
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
