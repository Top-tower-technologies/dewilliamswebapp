import DashboardCard from "@/components/reusable/DashboardCard";
import GuestTable from "@/components/reusable/GuestTable";
import Navbar from "@/components/reusable/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <section className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <DashboardCard
          title="Total Bookings"
          value="2,440"
          percentageChange="15.2%"
          isPositive
          highlightText="20%"
          subtitle="Increase since last month"
        />
        <DashboardCard
          title="Occupied Room"
          value="12/50"
          percentageChange="15.2%"
          isPositive
          subtitle="from 6,532 (last week)"
        />
        <DashboardCard
          title="Available Rooms"
          value="38/50"
          percentageChange="25%"
          isPositive
          subtitle="from 6,532 (last week)"
        />
        <DashboardCard
          title="Cancelled Bookings"
          value="8"
          percentageChange="12%"
          isPositive={false}
          subtitle="from 6,532 (last week)"
        />
      </section>

      <GuestTable />
    </>
  );
};

export default page;
