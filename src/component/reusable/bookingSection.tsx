"use client";
import Button from "./button";

const BookingSection = () => {
  return (
    <section className="flex flex-col md:flex-row min-h-[60vh]">
      {/* Left Box */}
      <div className="bg-[#D3AE00] text-white flex justify-center items-center w-full md:w-1/2 p-10">
        <div className="bg-white text-black p-8 max-w-sm">
          <h2 className="text-xl font-semibold mb-2">
            Begin your Booking Here
          </h2>
          <p className="text-sm">
            Designed by a team of seasoned architects, designers and
            connoisseurs
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="w-full md:w-1/2 p-10">
        <form className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="First Name"
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border p-2 w-full"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            className="border p-2 w-full"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="border p-2 w-full"
          />
          <textarea
            placeholder="Special Request"
            className="border p-2 w-full h-24"
          ></textarea>

          <p className="text-xs text-gray-600">
            By proceeding, I agree to De-Williams’s Terms & Conditions, Privacy
            Policy
          </p>

          {/* <button
            type="submit"
            className="bg-yellow-600 text-white px-6 py-2 rounded"
          ></button> */}

          <Button
            variant="primary"
            // type="submit"
            onClick={() => alert("Finding Stay...")}
          >
            Check Availability
          </Button>
        </form>
      </div>
    </section>
  );
};

export default BookingSection;
