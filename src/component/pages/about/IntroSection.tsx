import Button from "@/component/reusable/button";
import { FaStar } from "react-icons/fa";

const IntroSection = () => {
  return (
    <section className="w-full px-6 md:px-16 py-24 bg-white text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-between">
        {/* Left Side: Headline & Stars */}
        <div className="md:w-3/4 grid place-items-center">
          <h2 className="text-xl md:text-3xl text-center leading-tight">
            Essence of Luxury at <br />
            De-Williams Lounge
          </h2>
        </div>

        {/* Right Side: Description & CTA */}
        <div className="text-sm md:text-base text-gray-700 space-y-4 md:w-3/4">
          <p className="text-gray-600 leading-relaxed">
            At De-Williams Lounge, we pride ourselves on offering more than just
            a place to stay – we provide a refined experience tailored to your
            comfort and convenience. Whether you're visiting for business or
            leisure, our facilities are designed to cater to you.
          </p>

          <p className="text-gray-600 leading-relaxed">
            At De-Williams Lounge, we pride ourselves on offering more than just
            a place to stay.
          </p>

          <Button variant="primary">Explore Rooms</Button>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
