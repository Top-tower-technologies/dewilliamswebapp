import Image from "next/image";
import exclusivebg from "../../../../public/bg/exclusivebg.png";

const ExclusiveLuxurySection2 = () => {
  return (
    <section className="relative w-full h-[500px] md:h-[600px]">
      {/* Background Image */}
      <Image
        src={exclusivebg}
        width={400}
        height={400}
        alt="Exclusive Luxury Poolside"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay box */}
      <div className="absolute bottom-10 right-6 md:bottom-20 md:right-16 bg-white p-6 md:p-10 max-w-xs shadow-xl z-10">
        <h3 className="text-xl md:text-2xl font-semibold mb-3 leading-snug">
          Experience <br /> Exclusive Luxury
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          Designed by a team of seasoned architects, designers and connoisseurs
        </p>
        <a
          href="#"
          className="text-sm font-semibold underline hover:text-yellow-600 transition"
        >
          Get Membership
        </a>
      </div>

      {/* Optional: dimmed background overlay */}
      <div className="absolute inset-0 bg-black/10" />
    </section>
  );
};

export default ExclusiveLuxurySection2;
