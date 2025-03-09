import Image from "next/image";
import roomsbg from "../../../../public/bg/roomsbg.png";
import Button from "@/component/reusable/button";

const rooms = [
  {
    name: "Deluxe Standard",
    bathroom: "1 Bathroom",
    beds: "Twin Beds",
    sleeps: "Sleeps 2",
    price: "$375 / Night",
    highlight: true,
  },
  {
    name: "Presidential Suite",
    bathroom: "1 Bathroom",
    beds: "Twin Beds",
    sleeps: "Sleeps 2",
    price: "$975 / Night",
  },
  {
    name: "Deluxe Standard",
    bathroom: "1 Bathroom",
    beds: "Twin Beds",
    sleeps: "Sleeps 2",
    price: "$375 / Night",
  },
];

const RoomsAndSuites = () => {
  return (
    <section className="py-16 px-4 md:px-12">
      <h2 className="text-2xl md:text-3xl font-medium mb-8">Rooms & Suites</h2>
      <div className="relative w-full overflow-hidden rounded-md">
        <Image
          src={roomsbg} // replace with your room image
          alt="Rooms"
          width={400}
          height={400}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bottom-[-40%] flex items-center justify-center gap-x-10 px-6 ">
          {rooms.map((room, index) => (
            <div
              key={index}
              className={`border-t text-sm text-black p-6 min-w-[240px] max-w-[270px] rounded-md shadow-md ${
                room.highlight
                  ? "bg-white border-none"
                  : "border-t-white text-white rounded-none backdrop-blur-xs"
              }`}
            >
              <h3 className="text-[20px] mb-3">{room.name}</h3>
              <ul
                className={`text-sm space-y-2 mb-3 ${
                  room.highlight ? "text-gray-700" : " text-white"
                }`}
              >
                <li>🛁 {room.bathroom}</li>
                <li>
                  🛏️ {room.beds} 🧍 {room.sleeps}
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{room.price}</span>
                {room.highlight && <Button>Book now</Button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsAndSuites;
