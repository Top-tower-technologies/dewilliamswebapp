const amenities = [
  {
    title: "Gym & Fitness",
    description:
      "Designed by a team of seasoned architects, designers and connoisseurs",
  },
  {
    title: "SPA & Body Treatment",
    description:
      "Designed by a team of seasoned architects, designers and connoisseurs",
  },
  {
    title: "Experience Exclusive Luxury",
    description:
      "Designed by a team of seasoned architects, designers and connoisseurs",
  },
];

const AmenitiesSection = () => {
  return (
    <section className="py-16 px-4 md:px-12">
      <h2 className="text-2xl md:text-3xl font-medium mb-10">
        Amenities & Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {amenities.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 p-6 gap-y-7 rounded-md flex flex-col justify-between shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-[20px] w-1/2">{item.title}</h3>
            <p className="text-md text-gray-700">{item.description}</p>
            <a
              href="#"
              className="text-sm font-semibold underline hover:text-yellow-600"
            >
              Learn More
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AmenitiesSection;
