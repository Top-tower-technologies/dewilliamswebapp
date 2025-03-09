import Image from "next/image";
import { FaBath } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { MdPerson } from "react-icons/md";
import Button from "./button";

interface RoomCardProps {
  image: any;
  reverse?: boolean; // Determines card position
}

const SuperiorRoomCard: React.FC<RoomCardProps> = ({
  image,
  reverse = false,
}) => {
  return (
    <div className="relative w-full h-[500px]">
      <Image
        src={image}
        width={400}
        height={400}
        alt="Superior Room"
        className="w-full h-full object-cover"
      />
      <div
        className={`absolute top-6 space-y-5 ${
          reverse ? "left-6" : "right-6"
        } bg-white p-8 shadow-lg w-120`}
      >
        <h2 className="text-[20px]">Superior Single Room</h2>
        <p className="text-gray-500 text-sm mt-1">From $375 / Night</p>
        <p className="text-gray-600 text-md mt-2">
          Indulge in the perfect blend of luxury and functionality, whether
          you’re a traveler or a business visitor.
        </p>
        <div className="flex items-center gap-4 text-gray-700 text-sm mt-4">
          <span className="flex items-center gap-1">
            <FaBath /> 1 Bathroom
          </span>
          <span className="flex items-center gap-1">
            <FaBed /> Twin Beds
          </span>
          <span className="flex items-center gap-1">
            <MdPerson /> Sleeps 2
          </span>
        </div>
        <Button>Book Now</Button>
      </div>
    </div>
  );
};

export default SuperiorRoomCard;
