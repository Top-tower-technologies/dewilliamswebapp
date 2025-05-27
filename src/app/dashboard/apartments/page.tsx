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
  const [rooms, setRooms] = useState<any[]>([]);
  const columns = [
    { key: 'service_number', header: 'Apartment Number', cellClassName: 'font-medium' },
    { key: 'name', header: 'Apartment Name', },
    { key: 'occupancy', header: 'Capacity' },
    { key: 'early_NGN_price', header: 'Promotion' },
    { key: 'standard_NGN_price', header: 'Standard Price' },
    {
      key: 'status',
      header: 'Status',
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


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get(`/staff/services/apartment_service/list/view`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` },
          // params: { service_type: 'room_service' }
        });
        console.log(response.data)
        setRooms(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <MainLayout buttonText={""} buttonVisible={true} navigation={<PageHeader page='Apartments' icon={false} />}>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Apartments"
            value="0"
            change={0}
            previousValue=""
          />
          <StatCard
            title="Currently Available"
            value="0"
            change={0}
            previousValue=""
          />
          <StatCard
            title="Currently Occupied"
            value="0"
            change={0}
            previousValue=""
          />
          <StatCard
            title="Checked-Out Today"
            value="0"
            negative={true}
            change={0}
            previousValue=""
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <GuestDetailsCard>
            <DynamicTable
              columns={columns}
              data={rooms}
              actions={actions}
              itemsPerPage={10}
              showCheckbox={true}
              showActions={true}
            />
          </GuestDetailsCard>
        </div>
      </div>
    </MainLayout>
  );
}