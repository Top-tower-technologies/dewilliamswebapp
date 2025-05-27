// app/page.jsx
'use client'

import MainLayout from "@/components/layout/MainLayout";
import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { OccupancyTrendCard } from "@/components/reusable/OccupancyTrendCard";
import PageHeader from "@/components/reusable/PageHeader";
import { StatCard } from "@/components/reusable/StatCard";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axiosInstance";
import { DynamicTable } from "@/components/reusable/GuestTable";


export default function Dashboard() {
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
  const [rooms, setRooms] = useState<any[]>([]);
  const router = useRouter();


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/staff/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

    useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get(`/staff/services/room_service/list/view`, {
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


  // Sample bookings data
  const bookings: Record<string, { id: string; code: string; nights: number; startDay: number }[]> = {
    'room-400': [
      { id: 'b1', code: 'BO202', nights: 3, startDay: 11 },
      { id: 'b2', code: 'BO202', nights: 2, startDay: 14 },
      { id: 'b3', code: 'BO202', nights: 1, startDay: 16 },
      { id: 'b4', code: 'BO202', nights: 1, startDay: 17 },
      { id: 'b5', code: 'BO202', nights: 2, startDay: 18 },
    ],
    'room-401': [
      { id: 'b6', code: 'BO02', nights: 1, startDay: 11 },
      { id: 'b7', code: 'BO202', nights: 1, startDay: 12 },
      { id: 'b8', code: 'BO202', nights: 3, startDay: 13 },
      { id: 'b9', code: 'BO202', nights: 2, startDay: 16 },
      { id: 'b10', code: 'BO202', nights: 2, startDay: 19 },
    ],
    'room-402': [
      { id: 'b11', code: 'BO202', nights: 2, startDay: 11 },
      { id: 'b12', code: 'BO202', nights: 1, startDay: 13 },
      { id: 'b13', code: 'BO202', nights: 5, startDay: 14 },
      { id: 'b14', code: 'BO202', nights: 1, startDay: 20 },
    ],
    'room-200': [
      { id: 'b15', code: 'BO202', nights: 1, startDay: 12 },
      { id: 'b16', code: 'BO202', nights: 3, startDay: 13 },
      { id: 'b17', code: 'BO202', nights: 2, startDay: 16 },
      { id: 'b18', code: 'BO202', nights: 1, startDay: 19 },
      { id: 'b19', code: 'BO202', nights: 1, startDay: 20 },
    ],
    'room-201': [
      { id: 'b20', code: 'BO202', nights: 5, startDay: 11 },
      { id: 'b21', code: 'BO202', nights: 1, startDay: 19 },
    ],
  };

  const getBookingForCell = (roomId: string, day: number) => {
    const roomBookings = bookings[roomId] || [];
    return roomBookings.find(booking =>
      day >= booking.startDay && day < booking.startDay + booking.nights
    );
  };

  const getBookingSpan = (roomId: string, day: number) => {
    const booking = getBookingForCell(roomId, day);
    if (!booking) return null;

    const daysRemaining = booking.startDay + booking.nights - day;
    const visibleDays = Math.min(daysRemaining, booking.startDay + booking.nights - day);

    return {
      booking,
      span: visibleDays,
      isStart: day === booking.startDay
    };
  };

  const roomsByType = rooms.reduce((acc: Record<string, typeof rooms>, room) => {
    if (!acc[room.type]) {
      acc[room.type] = [];
    }
    acc[room.type].push(room);
    return acc;
  }, {} as Record<string, typeof rooms>);

  const columns = [
    { key: 'service_number', header: 'Room Number', cellClassName: 'font-medium' },
    { key: 'name', header: 'Room Name', },
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
    // { key: 'maintenance', label: 'Schedule Maintenance' },
    // { key: 'details', label: 'View Details' } 
  ];

  // Sample data - replace with your actual data


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
        router.push(`/dashboard/bookings/new-booking`);
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
    <MainLayout buttonText={""} buttonVisible={true} navigation={<PageHeader page='Rooms' icon={false} />}>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Occupied Rooms"
            value={dashboardData.occupied_rooms.toString()}
            change={0}
            previousValue=" "
          />
          <StatCard
            title="Guest Satisfaction"
            value="32"
            change={0}
            previousValue=" "
          />
          <StatCard
            title="Available Rooms"
            value={dashboardData.available_rooms.toString()}
            change={0}
            previousValue=" "
          />
          <StatCard
            title="Cancelled Bookings"
            value={dashboardData.canceled_reservations.toString()}
            change={0}
            negative={true}
            previousValue=" "
          />
        </div>


        <Tabs defaultValue="list" className="w-">
          <div className="flex justify-end mb-6">
            <TabsList className="bg-gray-100 rounded-lg flex">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calender">Calendar View</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="list" >
            <GuestDetailsCard>
              <DynamicTable
                columns={columns}
                data={rooms}
                actions={actions}
                onRowAction={handleRowAction}
                itemsPerPage={10}
                showCheckbox={true}
                showActions={true}
              />
            </GuestDetailsCard>
          </TabsContent>
          <TabsContent value="calender" >
            
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}