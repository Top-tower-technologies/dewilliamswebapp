import Button from "@/component/reusable/button";
import Image from "next/image";
import roomsbg from "../../../../public/bg/roomsbg.png";

const CardSection = () => {
  return (
    <section className="w-full px-6 md:px-16 py-24 bg-white text-black">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 place-items-center">
        {/* Left Side: Headline & Stars */}
        <div className="w-2/4 grid place-items-end">
          <Image
            alt=""
            src={roomsbg}
            width={400}
            height={400}
            className="object-right w-full h-100"
          />
        </div>

        {/* Right Side: Description & CTA */}
        <div className="text-sm md:text-base text-gray-700 space-y-4 md:w-3/4">
          <h2 className="text-xl md:text-3xl leading-tight">
            Alugo All Night Festival
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Redefining luxury, each hotel room is a temple to total
            regeneration. The difference is in the details, borrowed from
            residential living at its most sublime.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Designed to meet every need, our proprietary sleep system ensures
            that every night is a dream come true, leaving you primed to perform
            in ways you never thought possible.
          </p>

          <Button variant="primary">Explore Rooms</Button>
        </div>
      </div>
    </section>
  );
};

export default CardSection;
