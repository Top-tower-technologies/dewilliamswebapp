"use client"
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardCard from "@/components/reusable/DashboardCard";
import axiosInstance from "@/api/axiosInstance";
import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { DynamicTable } from "@/components/reusable/GuestTable";

const page = () => {
  const [tableData, setTableData] = useState([]);
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
        const response = await axiosInstance.get("/staff/dashboard",
          { headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` } }
        );
        console.log(response.data)
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axiosInstance.get("/staff/reservations?page=1&limit=8", {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
        });
        // Adjust this line based on your actual API response structure
        const guests = (response.data.data.data || []).map((guest: any) => ({
          ...guest,
          id: guest.id ? guest.id.slice(0, 10) : guest.id,
        }));
        console.log("Fetched guests:", guests);
        setTableData(guests);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchTableData();
  }, []);

const handleDownloadBtn = async () => {
  try {
    const response = await axiosInstance.get("/reservation/download", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('AuthKey')}`
      },
      responseType: 'blob'  // 👈 VERY important
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservations.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download failed:', err);
  }
};


  const columns = [
    { key: 'guest_id', header: 'Guest ID', cellClassName: 'font-medium' },
    { key: 'full_name', header: 'Full Name', },
    { key: 'booking_id', header: 'Booking ID', },
    { key: 'service_no', header: 'Service No' },
    { key: 'phone', header: 'Phone Number' },
    { key: 'total_amount', header: 'Total Amount' },
    { key: 'occupancy', header: 'Occupancy' },
    {
      key: 'status',
      header: 'status',
      type: 'badge',
      badgeVariant: (status: string) => {
        switch (status) {
          case 'Available': return 'default';
          case 'Occupied': return 'destructive';
          case 'Maintenance': return 'secondary';
          default: return 'outline';
        }
      }
    }
  ];

  return (
    <MainLayout buttonText={"Download data"} handleClick={handleDownloadBtn}>
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

      <div className="p-6">
        <GuestDetailsCard>

          <DynamicTable
            columns={columns} // TODO: Replace with actual column definitions
            data={tableData}    // TODO: Replace with actual data array
            showCheckbox={true}
            itemsPerPage={10}
          />
        </GuestDetailsCard>
      </div>

    </MainLayout>
  );
};

export default page;