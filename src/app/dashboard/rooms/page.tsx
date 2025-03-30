// app/page.jsx
'use client'

import MainLayout from "@/components/layout/MainLayout";
import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { OccupancyTrendCard } from "@/components/reusable/OccupancyTrendCard";
import PageHeader from "@/components/reusable/PageHeader";
import { StatCard } from "@/components/reusable/StatCard";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChevronLeft, ChevronRight, List, SlidersHorizontal } from 'lucide-react';


export default function Dashboard() {
  const guestData = [
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Pending' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
    { id: '#16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Pending' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
  ];

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

  // Function to determine if a cell has a booking
  const getBookingForCell = (roomId: string, day: number) => {
    const roomBookings = bookings[roomId] || [];
    return roomBookings.find(booking =>
      day >= booking.startDay && day < booking.startDay + booking.nights
    );
  };

  // Function to get booking span (to handle multi-day bookings)
  const getBookingSpan = (roomId: string, day: number) => {
    const booking = getBookingForCell(roomId, day);
    if (!booking) return null;

    // Calculate how many days are visible in the current view
    const daysRemaining = booking.startDay + booking.nights - day;
    const visibleDays = Math.min(daysRemaining, booking.startDay + booking.nights - day);

    return {
      booking,
      span: visibleDays,
      isStart: day === booking.startDay
    };
  };

  // Group rooms by type
  const roomsByType = rooms.reduce((acc: Record<string, typeof rooms>, room) => {
    if (!acc[room.type]) {
      acc[room.type] = [];
    }
    acc[room.type].push(room);
    return acc;
  }, {} as Record<string, typeof rooms>);

  return (
    <MainLayout buttonText={""} buttonVisible={true} navigation={<PageHeader page='Rooms' icon={false} />}>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Occupied Room"
            value="256"
            change={15.2}
            previousValue="from 6,532 (last week)"
          />
          <StatCard
            title="Guest Satisfaction"
            value="32"
            change={15.2}
            previousValue="from 6,532 (last week)"
          />
          <StatCard
            title="Available Rooms"
            value="115"
            change={15.2}
            previousValue="from 6,532 (last week)"
          />
          <StatCard
            title="Cancelled bookings"
            value="6,672"
            change={15.2}
            negative={true}
            previousValue="from 6,532 (last week)"
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
            <GuestDetailsCard guestData={guestData} />
          </TabsContent>
          <TabsContent value="calender" >
            <>
              {/* Filter and Calendar */}
              <div className="mb-6">
                <div className="grid grid-cols-12 gap-2">
                  {/* Filter button */}
                  <div className="col-span-1">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <SlidersHorizontal size={16} />
                      <span>Filter</span>
                    </Button>
                  </div>

                  {/* Days header */}
                  {days.map((day, index) => (
                    <div key={index} className="col-span-1">
                      <div className="text-center font-medium">
                        <div className="text-lg">{day.day}</div>
                        <div className="text-sm text-gray-500">{day.weekday}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room bookings by type */}
              {Object.entries(roomsByType).map(([type, typeRooms]) => (
                <div key={type} className="mb-6">
                  {/* Suite type header */}
                  <div className="font-medium text-lg mb-4">{type}</div>

                  {/* Rooms of this type */}
                  {typeRooms.map(room => (
                    <div key={room.id} className="grid grid-cols-12 gap-2 mb-4">
                      {/* Room number */}
                      <div className="col-span-1 flex items-center">
                        <div className="text-gray-700">ROOM {room.number}</div>
                      </div>

                      {/* Days cells */}
                      {days.map((day, dayIndex) => {
                        const bookingData = getBookingSpan(room.id, day.day);

                        // If no booking or not the start day of a booking
                        if (!bookingData || !bookingData.isStart) {
                          return (
                            <div key={dayIndex} className="col-span-1">
                              {bookingData ? null : (
                                <div className="bg-gray-100 p-4 rounded-md text-center">
                                  Empty
                                </div>
                              )}
                            </div>
                          );
                        }

                        // For bookings that start on this day
                        const { booking, span } = bookingData;
                        return (
                          <div key={dayIndex} className={`col-span-${span} flex`}>
                            <div className="bg-gray-100 p-4 rounded-md w-full">
                              <div>{booking.code}</div>
                              <div className="text-sm text-gray-500">
                                {booking.nights > 1 ? `${booking.nights} Nights` : '1 Night'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-gray-500">Page 1 of 30</div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3].map(page => (
                    <Button
                      key={page}
                      variant={page === 3 ? "default" : "ghost"}
                      className={page === 3 ? "bg-blue-500 text-white" : ""}
                      size="sm"
                    >
                      {page}
                    </Button>
                  ))}
                  <span>...</span>
                  {[10, 11, 12].map(page => (
                    <Button key={page} variant="ghost" size="sm">
                      {page}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    <ChevronLeft size={16} />
                    Previous
                  </Button>
                  <Button variant="default" size="lg" className="bg-black text-white flex items-center gap-2">
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}