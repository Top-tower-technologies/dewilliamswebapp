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

import { ChevronLeft, ChevronRight, List, SlidersHorizontal } from 'lucide-react';
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

  // Sample data for room bookings
  const rooms = [
    { id: 'room-400', number: '400', type: 'Deluxe Suite' },
    { id: 'room-401', number: '401', type: 'Deluxe Suite' },
    { id: 'room-402', number: '402', type: 'Deluxe Suite' },
    { id: 'room-200', number: '200', type: 'Supreme Suite' },
    { id: 'room-201', number: '201', type: 'Supreme Suite' },
  ];

  // Days of the week to display
  const days = [
    { day: 11, weekday: 'MON' },
    { day: 12, weekday: 'MON' },
    { day: 13, weekday: 'MON' },
    { day: 14, weekday: 'MON' },
    { day: 15, weekday: 'MON' },
    { day: 16, weekday: 'MON' },
    { day: 17, weekday: 'MON' },
    { day: 11, weekday: 'MON' },
    { day: 11, weekday: 'MON' },
    { day: 11, weekday: 'MON' },
  ];

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
    { key: 'roomNumber', header: 'Room Number', cellClassName: 'font-medium' },
    { key: 'name', header: 'Room Name', },
    { key: 'type', header: 'Room Type' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'price', header: 'Price per Night' },
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

  // Sample data - replace with your actual data
  const sampleData = [
    {
      roomNumber: '101',
      type: 'Single',
      capacity: 1,
      price: '$100',
      status: 'Available'
    },
    {
      roomNumber: '102',
      type: 'Double',
      capacity: 2,
      price: '$150',
      status: 'Occupied'
    },
    {
      roomNumber: '103',
      type: 'Suite',
      capacity: 4,
      price: '$300',
      status: 'Maintenance'
    },
    {
      roomNumber: '104',
      type: 'Double',
      capacity: 2,
      price: '$150',
      status: 'Available'
    }
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
    <MainLayout buttonText={""} buttonVisible={true} navigation={<PageHeader page='Rooms' icon={false} />}>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Occupied Rooms"
            value={dashboardData.occupied_rooms.toString()}
            change={0}
            previousValue="from last week"
          />
          <StatCard
            title="Guest Satisfaction"
            value="32"
            change={0}
            previousValue="from last week"
          />
          <StatCard
            title="Available Rooms"
            value={dashboardData.available_rooms.toString()}
            change={0}
            previousValue="from last week"
          />
          <StatCard
            title="Cancelled Bookings"
            value={dashboardData.canceled_reservations.toString()}
            change={0}
            negative={true}
            previousValue="from last week"
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
                data={[]}
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