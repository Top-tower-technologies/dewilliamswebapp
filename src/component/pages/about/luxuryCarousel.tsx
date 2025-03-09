"use client";
import Button from "@/component/reusable/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import carousel1 from "../../../../public/bg/rooms/room2.png";
import carousel2 from "../../../../public/bg/about/carousel2.png";
import carousel3 from "../../../../public/bg/about/carousel3.png";

const slides = [carousel2, carousel1, carousel3];

const LuxuryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to manually change slides
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full px-10 py-7">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Left Text Content */}
        <div className="md:w-1/3">
          <h2 className="text-3xl font-semibold">Luxury Rooms</h2>
          <p className="text-gray-600 my-3">
            Redefining luxury, each hotel room is a temple to total
            regeneration. The difference is in the details, borrowed from
            residential living at its most sublime. <br />
            <br /> Designed to meet every need, our proprietary sleep system
            ensures that every night is a dream come true, leaving you primed to
            perform in ways you never thought possible. <br />
            <br /> Wind down or wake up by streaming a series of stretches from
            your in-room media library. Choose from AM and PM Rituals developed
            to get you moving in the morning and to promote a more restful
            night’s sleep.
          </p>
          <Button>Explore room</Button>
        </div>

        {/* Right Image Slider */}
        <div className="md:w-2/3">
          <div className="w-full grid place-items-center gap-y-4">
            {/* Progress Indicator / Navigator */}
            <div className=" flex space-x-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-16 h-1 rounded cursor-pointer transition-all duration-300 ${
                    index === currentIndex ? "bg-black" : "bg-gray-300"
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            <Image
              src={slides[currentIndex]}
              width={400}
              height={400}
              alt="Luxury Room"
              className="w-full h-120 object-cover rounded-xl transition-opacity duration-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryCarousel;
