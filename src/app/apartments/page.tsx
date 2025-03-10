import { FooterLayout } from "@/component/reusable/footer";
import Navbar from "@/component/reusable/navbar";
import SuperiorRoomCard from "@/component/reusable/SuperiorRoomCard";
import room from "../../../public/bg/exclusivebg.png";
import room1 from "../../../public/bg/roomsbg.png";
import React from "react";
import Header from "@/component/pages/apartments/Header";

const page = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <div className="py-10 px-30 pt-20 bg-gray-100">
        <SuperiorRoomCard image={room1} reverse={true} />
      </div>
      <div className="space-y-20 py-20 bg-gray-100">
        <SuperiorRoomCard image={room} reverse={false} />
        <SuperiorRoomCard image={room} reverse={true} />
      </div>
      <FooterLayout />
    </div>
  );
};

export default page;
