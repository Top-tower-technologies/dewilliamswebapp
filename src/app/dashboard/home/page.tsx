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
        const response = await axiosInstance.get("/staff/guests?page=1&limit=8", {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
        });
        // Adjust this line based on your actual API response structure
        const guests = (response.data || []).map((guest: any) => ({
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

 const columns = [
    { key: 'guestId', header: 'Guest ID', cellClassName: 'font-medium' },
    { key: 'first_name', header: 'First Name', },
    { key: 'last_name', header: 'Last Name', },
    { key: 'room', header: 'Room' },
    { key: 'phone', header: 'Phone Number' },
    { key: 'price', header: 'Total Amount' },
    { key: 'occupancy', header: 'Occupancy' },
    {
      key: 'current_activity_status',
      header: 'Reservation',
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

  const actions = [
    { key: 'book', label: 'Book Room' },
    { key: 'maintenance', label: 'Schedule Maintenance' },
    { key: 'details', label: 'View Details' }
  ];

  const handleRowAction = (
    actionKey: string,
    item: {
      roomNumber: string;
      type: string;
      capacity: number;
      price: string;
      status: string;
    },
    index: number
  ) => {
    console.log(`Action: ${actionKey}`, item);
    // Add your action handling logic here
    switch (actionKey) {
      case 'book':
        console.log(`Booking room ${item.roomNumber}`);
        break;
      case 'maintenance':
        console.log(`Scheduling maintenance for room ${item.roomNumber}`);
        break;
      case 'details':
        console.log(`Viewing details for room ${item.roomNumber}`);
        break;
    }
  };

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

    <div className="p-6">
      <GuestDetailsCard>

        <DynamicTable
          columns={columns} // TODO: Replace with actual column definitions
          data={tableData}    // TODO: Replace with actual data array
          actions={actions} // TODO: Replace with actual actions if needed
          showCheckbox={true}
          itemsPerPage={10}
          showActions={true}
          onRowAction={(actionKey, item, index) => {
            console.log(`Action: ${actionKey}`, item);
            // Add your action handling logic here
            switch (actionKey) {
              case 'book':
                console.log(`Booking room for ${item.name}`);
                break;
              case 'maintenance':
                console.log(`Scheduling maintenance for ${item.roomNo}`);
                break;
              case 'details':
                console.log(`Viewing details for ${item.name}`);
                break;
              default:
                console.log(`Unknown action: ${actionKey}`);
                break;
            }
          }
          }
          renderCell={(item, column) => {
            if (column.key === 'status') {
              return (
                <span className={`badge ${item.status === 'Available' ? 'badge-success' : item.status === 'Occupied' ? 'badge-danger' : 'badge-secondary'}`}>
                  {item.status}
                </span>
              );
            }
            return item[column.key];
          }
          }
        />
      </GuestDetailsCard>
    </div>

    </MainLayout>
  );
};

export default page;