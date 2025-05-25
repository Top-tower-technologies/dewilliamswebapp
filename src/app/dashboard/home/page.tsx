"use client"
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardCard from "@/components/reusable/DashboardCard";
import axiosInstance from "@/api/axiosInstance";
import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { DynamicTable } from "@/components/reusable/GuestTable";

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

  const columns = [
    { key: 'id', header: 'Booking ID', cellClassName: 'font-medium' },
    { key: 'name', header: 'Full Name', },
    { key: 'number', header: 'Phone Number' },
    { key: 'roomNo', header: 'Room No' },
    { key: 'dateandtime', header: 'Issue date and time' },
    { key: 'price', header: 'Total Amount' },
    {
      key: 'status',
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

  // Sample data - replace with your actual data
  const sampleData = [
    {
      id: '16bh9489g',
      name: 'Oyefeso Afolabi',
      number: '07057997839',
      roomNo: '#401',
      dateandtime: '2023-10-01 12:00',
      price: '$100',
      status: 'Available'
    },
    {
      id: '16bh9489g',
      name: 'John Doe',
      number: '08012345678',
      roomNo: '#402',
      dateandtime: '2023-10-02 14:30',
      price: '$150',
      status: 'Occupied'
    },
    {
      id: '16bh9489g',
      name: 'Jane Smith',
      number: '09098765432',
      roomNo: '#403',
      dateandtime: '2023-10-03 09:15',
      price: '$200',
      status: 'Maintenance'
    },
    {
      id: '16bh9489g',
      name: 'Alice Johnson',
      number: '07011223344',
      roomNo: '#404',
      dateandtime: '2023-10-04 11:45',
      price: '$120',
      status: 'Available'
    }
  ];

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
          data={sampleData}    // TODO: Replace with actual data array
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