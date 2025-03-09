import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
import BookingSection from "./bookingSection";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "Member Benefits", href: "/benefits" },
  { name: "Rooms", href: "/rooms" },
  { name: "About Us", href: "/about" },
  { name: "Service Policy", href: "/policy" },
];

export const Footer = () => {
  return (
    <footer className="bg-white px-6 py-8 mt-12">
      <div className="flex flex-col-reverse gap-y-8 md:flex-row md:justify-between items-center">
        <div className="grid grid-cols-1 pl-10 gap-10 container mx-auto">
          {/* Navigation Links */}
          <div className="space-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-700 hover:text-[#D3AE00] block"
              >
                {link.name}
              </a>
            ))}
          </div>
          {/* Social Media & Copyright */}
          <div className="flex flex-col justify-between">
            <div className="flex space-x-4">
              <FaXTwitter className="text-xl hover:text-[#D3AE00] cursor-pointer" />
              <FaInstagram className="text-xl hover:text-[#D3AE00] cursor-pointer" />
              <FaFacebook className="text-xl hover:text-[#D3AE00] cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="bg-black text-white w-full p-4 rounded">
          <h3 className="font-semibold mb-2">Visit Us</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1982.1159653438218!2d3.330153311705003!3d6.565253668712673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d6110199b3f%3A0x3d36798b3d369327!2sAjao%20Estate%2C%20Lagos!5e0!3m2!1sen!2sng!4v1710000000000!5m2!1sen!2sng"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <p className="text-sm mt-2">
            Ajao Estate, opposite Bocas Filling Station, Oshodi, Lagos
          </p>
        </div>
      </div>
      <p className="text-xs mt-8 text-center">&copy; 2024 DE-Williams Lounge</p>
    </footer>
  );
};

export const FooterLayout = () => {
  return (
    <>
      <BookingSection />
      <Footer />
    </>
  );
};
