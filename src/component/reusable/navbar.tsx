"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import Image from "next/image";
import logo from "../../../public/logo.png";
import Button from "./button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Rooms", path: "/rooms" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Apartments", path: "/apartments" },
  { name: "Spa", path: "/spa" },
  { name: "Gym", path: "/gym" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white px-6 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="logo"
            width={400}
            height={100}
            className="h-[40px] w-[224px]"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`block hover:text-[#292929]/70 ${
                pathname === link.path ? "text-[#292929]/70" : "text-black"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex space-x-3">
          <Button variant="primary" onClick={() => alert("Finding Stay...")}>
            Find Stay
          </Button>

          <Button variant="secondary" onClick={() => alert("Joining...")}>
            Join
          </Button>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col mt-3 space-y-2 bg-white border-t px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`block hover:text-[#292929]/70 ${
                pathname === link.path ? "text-[#292929]/70" : "text-black"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => alert("Finding Stay...")}
              className="w-full"
            >
              Find Stay
            </Button>

            <Button
              variant="secondary"
              onClick={() => alert("Joining...")}
              className="w-full"
            >
              Join
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
