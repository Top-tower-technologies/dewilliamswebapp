// app/page.jsx
'use client'

import axiosInstance from "@/api/axiosInstance";
import MainLayout from "@/components/layout/MainLayout";
import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { DynamicTable } from "@/components/reusable/GuestTable";
import { OccupancyTrendCard } from "@/components/reusable/OccupancyTrendCard";
import PageHeader from "@/components/reusable/PageHeader";
import { StatCard } from "@/components/reusable/StatCard";
import { useEffect, useState } from "react";


export default function Dashboard() {
  const [guestTableData, setGuestTableData] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    total_guest: 0,
    currently_checkedout: 0,
    currently_checkedin: 0,
    current_guests: 0,
  });
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/staff/guests/stats",
          { headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` } }
        );
        // console.log(response.data)
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
        // console.log("Fetched guests:", guests);
        setGuestTableData(guests);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchTableData();
  }, []);

  const colums = [
    { key: 'id', header: 'ID', type: 'text', className: 'w-1/3' },
    { key: 'first_name', header: 'First Name', type: 'text', className: 'w-1/3' },
    { key: 'last_name', header: 'Last Name', type: 'text', className: 'w-1/3' },
    { key: 'phone', header: 'Phone', type: 'text', className: 'w-1/3' },
    { key: 'room', header: 'Room', type: 'text', className: 'w-1/4' },
    { key: 'current_activity_status', header: 'Status', type: 'badge', className: 'w-1/4' },
  ];

  return (
    <MainLayout buttonText={""} buttonVisible={true} navigation={<PageHeader page='Guests' icon={false} />}>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Guests"
            value={dashboardData.total_guest}
            change={0}
            previousValue=""
          />
          <StatCard
            title="Currently Checked-In"
            value={dashboardData.currently_checkedin || 0}
            change={0}
            previousValue=""
          />
          <StatCard
            title="Checked-Out Today"
            value={dashboardData.currently_checkedout || 0}
            change={0}
            previousValue=""
          />
          <StatCard
            title="Checked-Out Today"
            value={dashboardData.current_guests || 0}
            change={0}
            previousValue=""
          />
        </div>

        <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GuestDetailsCard>

              <DynamicTable
                columns={colums}
                data={guestTableData}
                actions={[
                  { key: 'book', label: 'Book Room' },
                  { key: 'maintenance', label: 'Schedule Maintenance' },
                  { key: 'details', label: 'View Details' }
                ]}
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
                      console.log(`Scheduling maintenance for ${item.room}`);
                      break;
                    case 'details':
                      console.log(`Viewing details for ${item.name}`);
                      break;
                    default:
                      console.log(`Unknown action: ${actionKey}`);
                      break;
                  }
                }}
                renderCell={(item, column) => {
                  if (column.key === 'status') {
                    return (
                      <span className={`badge ${item.status === 'Checked in' ? 'badge-success' : 'badge-warning'}`}>
                        {item.status}
                      </span>
                    );
                  }
                  return item[column.key];
                }}
              />
            </GuestDetailsCard>
          </div>
          <div className="lg:col-span-1">
            <OccupancyTrendCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}