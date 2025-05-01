"use client"
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardCard from "@/components/reusable/DashboardCard";
import GuestTable from "@/components/reusable/GuestTable";
import axiosInstance from "@/api/axiosInstance";

const page = () => {
  const [dashboardData, setDashboardData] = useState({
    total_reservations: 0,
    pending_reservations: 0,
    canceled_reservations: 0,
    confirmed_reservations: 0,
    occupied_rooms: 0,
    available_rooms: 0,
    occupied_apartments: 0,
    available_apartments: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/staff/dashboard");
        console.log(response.data)
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout buttonText={"Download data"}>
      <section className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <DashboardCard
          title="Total Reservations"
          value={dashboardData.total_reservations.toString()}
          percentageChange="N/A"
          isPositive
          subtitle="Total reservations made"
        />
        <DashboardCard
          title="Occupied Rooms"
          value={`${dashboardData.occupied_rooms}/${dashboardData.occupied_rooms + dashboardData.available_rooms}`}
          percentageChange="N/A"
          isPositive
          subtitle="Currently occupied rooms"
        />
        <DashboardCard
          title="Available Rooms"
          value={`${dashboardData.available_rooms}/${dashboardData.occupied_rooms + dashboardData.available_rooms}`}
          percentageChange="N/A"
          isPositive
          subtitle="Rooms available for booking"
        />
        <DashboardCard
          title="Cancelled Reservations"
          value={dashboardData.canceled_reservations.toString()}
          percentageChange="N/A"
          isPositive={false}
          subtitle="Reservations canceled"
        />
      </section>

      <GuestTable />
    </MainLayout>
  );
};

export default page;