import Image from "next/image";
import Headerbg from "../../../../public/bg/apartments.png";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Header = () => {
  return (
    <header className="w-full bg-[#D3AE00] text-white text-sm">
      <Image
        alt=""
        src={Headerbg}
        width={400}
        height={400}
        className="w-full h-[500px] object-cover"
      />
      <div className="flex flex-row justify-center md:justify-between items-center gap-2 px-12 py-2">
        {/* Email */}
        <div className="flex items-center gap-1">
          <FaEnvelope className="text-xs" />
          <span className="font-medium">Email Us</span>
          <a href="mailto:Reservation@dewilliams.com" className="underline">
            Reservation@dewilliams.com
          </a>
        </div>

        {/* Phone */}
        <div className="hidden md:flex items-center gap-1">
          <FaPhoneAlt className="text-xs" />
          <span className="font-medium">Call Us</span>
          <a href="tel:+2347057997839" className="underline">
            +234 705 799 7839
          </a>
        </div>

        {/* Location */}
        <div className="hidden md:flex items-center gap-1">
          <FaMapMarkerAlt className="text-xs" />
          <span className="font-medium">Visit Us</span>
          <a
            href="https://www.google.com/maps/place/No+12,+Oluyole+Estate+Road,+Ibadan,+Oyo+State,+Nigeria"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            No. 12, Oluyole Estate Road, Ibadan, Oyo State, Nigeria.
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
