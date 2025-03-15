import Image from "next/image";
import React, { ReactNode } from "react";
import Marquee from "react-fast-marquee";
import Admin from "../../../public/icon/Administrator.png";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="auth-layout w-full h-[100vh] flex flex-col justify-center items-center bg-white relative overflow-hidden">
      <div className="w-full bg-[#fcfcea] py-1 whitespace-nowrap overflow-x-auto text-lg text-center text-gray-700 font-medium absolute top-1">
        <Marquee>
          DE-WILLAMS HOTEL MANAGEMENT SYSTEM &nbsp; | &nbsp; FOR AUTHORIZED
          USERS ONLY &nbsp; | &nbsp; WELCOME TO DE-WILLAMS HOTEL MANAGEMENT
          SYSTEM
        </Marquee>
      </div>
      <div className="flex flex-col items-center px-6 py-10 w-full max-w-md">
        {/* Icon */}
        {/* <div className=" mb-6"> */}
        <div className="w-28 h-28 mb-6 rounded-full flex items-center justify-center">
          <Image alt="admin" src={Admin} width={200} height={200} />
        </div>

        {children}
      </div>
    </div>
    // </div>
  );
};

export default AuthLayout;
