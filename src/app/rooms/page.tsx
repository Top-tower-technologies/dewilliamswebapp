import Header from "@/component/pages/rooms/Header";
import { FooterLayout } from "@/component/reusable/footer";
import Navbar from "@/component/reusable/navbar";
import SuperiorRoomCard from "@/component/reusable/SuperiorRoomCard";
import room1 from "../../../public/bg/rooms/room1.png";
import room2 from "../../../public/bg/rooms/room2.png";
import room3 from "../../../public/bg/rooms/room3.png";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <div className="space-y-20 py-20 bg-gray-100">
        <SuperiorRoomCard image={room1} reverse={false} />
        <SuperiorRoomCard image={room2} reverse={true} />
        <SuperiorRoomCard image={room3} reverse={false} />
      </div>
      <FooterLayout />
    </div>
  );
};

export default page;
