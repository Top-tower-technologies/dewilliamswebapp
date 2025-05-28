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
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { CheckCircle, LogOut, User, TriangleAlert } from 'lucide-react'

import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axiosInstance";
import { DynamicTable } from "@/components/reusable/GuestTable";

interface RoomData {
  service_number: string;
  name: string;
  occupancy: number;
  early_NGN_price: string;
  standard_NGN_price: string;
  status: string;
  type: string;
  service_id: string;
}

interface ActionItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

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
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const router = useRouter();

  // Modal states
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [releaseModalOpen, setReleaseModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

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

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get(`/staff/services/room_service/list/view`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` },
      });
      console.log(response.data)
      
      // Map room statuses to simplified ones
      const roomsWithSimplifiedStatus = response.data.data.map((room: any) => ({
        ...room,
        status: mapToSimplifiedStatus(room.status)
      }));
      
      setRooms(roomsWithSimplifiedStatus);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Helper function to map complex statuses to simplified ones
  const mapToSimplifiedStatus = (originalStatus: string): string => {
    const normalizedStatus = originalStatus?.toLowerCase() || '';
    
    switch (normalizedStatus) {
      case 'occupied':
      case 'reserved':
      case 'confirmed':
      case 'checked_in':
        return 'booked';
      
      case 'available':
      case 'vacant':
      case 'ready':
      case 'clean':
        return 'available';
      
      case 'maintenance':
      case 'out_of_order':
        return 'available'; // or you could add a third status for maintenance
      
      default:
        return 'available';
    }
  };

  // Get actions based on room status
  const getActionsForStatus = (status: string): ActionItem[] => {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'available':
        return [
          { key: 'book', label: 'Book Room', icon: <CheckCircle size={16} />, variant: 'default' },
          { key: 'details', label: 'View Details', icon: <User size={16} />, variant: 'outline' }
        ];
      
      case 'booked':
        return [
          { key: 'release', label: 'Release Room', icon: <LogOut size={16} />, variant: 'destructive' },
          { key: 'details', label: 'View Details', icon: <User size={16} />, variant: 'outline' }
        ];
      
      default:
        return [
          { key: 'details', label: 'View Details', icon: <User size={16} />, variant: 'outline' }
        ];
    }
  };

  const releaseRoom = async (room: RoomData) => {
    try {
      setActionLoading(true);
      // You'll need to replace this with your actual release API endpoint
      const response = await axiosInstance.post(`/staff/rooms/${room.service_id}/release`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      });
      
      if (response.data.success) {
        console.log('Room released successfully');
        await fetchRooms();
        setReleaseModalOpen(false);
        setSelectedRoom(null);
      } else {
        throw new Error(response.data.message || 'Failed to release room');
      }
    } catch (error) {
      console.error('Error releasing room:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Custom cell renderer
  const renderCell = (item: RoomData, column: any) => {
    if (column.key === 'status') {
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case 'booked': return 'bg-red-100 text-red-800';
          case 'available': return 'bg-green-100 text-green-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      };

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      );
    }

    // Format prices with currency
    if (column.key === 'early_NGN_price' || column.key === 'standard_NGN_price') {
      return `₦${parseFloat(item[column.key as keyof RoomData] as string).toLocaleString()}`;
    }

    return item[column.key as keyof RoomData];
  };

  const columns = [
    { key: 'service_number', header: 'Room Number', cellClassName: 'font-medium' },
    { key: 'name', header: 'Room Name' },
    { key: 'occupancy', header: 'Capacity' },
    { key: 'early_NGN_price', header: 'Promotion Price' },
    { key: 'standard_NGN_price', header: 'Standard Price' },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      badgeVariant: (status: string) => {
        switch (status.toLowerCase()) {
          case 'booked': return 'destructive';
          case 'available': return 'default';
          default: return 'outline';
        }
      }
    }
  ];

  const handleRowAction = (actionKey: string, item: RoomData, index: number) => {
    console.log(`Action: ${actionKey}`, item);
    
    setSelectedRoom(item);
    
    switch (actionKey) {
      case 'book':
        setBookModalOpen(true);
        break;
        
      case 'release':
        setReleaseModalOpen(true);
        break;
        
      case 'details':
        console.log(`Viewing details for room ${item.service_number}`);
        router.push(`/dashboard/rooms/${item.service_id}`);
        break;
        
      default:
        console.log(`Unknown action: ${actionKey}`);
        break;
    }
  };

  // Calculate stats based on simplified statuses
  const availableRooms = rooms.filter(room => room.status === 'available').length;
  const bookedRooms = rooms.filter(room => room.status === 'booked').length;
  const occupancyRate = rooms.length > 0 ? Math.round((bookedRooms / rooms.length) * 100) : 0;

  return (
    <MainLayout buttonText={""} buttonVisible={true} navigation={<PageHeader page='Rooms' icon={false} />}>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Booked Rooms"
            value={bookedRooms.toString()}
            change={0}
            previousValue=" "
            negative={true}
          />
          <StatCard
            title="Available Rooms"
            value={availableRooms.toString()}
            change={0}
            previousValue=" "
          />
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            change={0}
            previousValue=" "
          />
          <StatCard
            title="Total Rooms"
            value={rooms.length.toString()}
            change={0}
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
          <TabsContent value="list">
            <GuestDetailsCard>
              <DynamicTable
                columns={columns}
                data={rooms}
                actions={(item: RoomData) => getActionsForStatus(item.status)}
                onRowAction={handleRowAction}
                itemsPerPage={10}
                showCheckbox={true}
                showActions={true}
                renderCell={renderCell}
              />
            </GuestDetailsCard>
          </TabsContent>
          <TabsContent value="calender">
            {/* Calendar view content */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Book Room Modal */}
      <Dialog open={bookModalOpen} onOpenChange={() => setBookModalOpen(false)}>
        <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
          <div className="p-8 bg-[#F0F9FF] rounded-full grid place-items-start">
            <CheckCircle size={100} className="text-[#0369A1]" />
          </div>
          <DialogTitle className="text-2xl">Book Room?</DialogTitle>
          <DialogDescription className="text-center text-md">
            Are you sure you want to book room <strong>{selectedRoom?.service_number}</strong> ({selectedRoom?.name})?
          </DialogDescription>

          <div className="grid space-y-2">
            <Button 
              onClick={() => router.push('/dashboard/bookings/new-booking')}
              disabled={actionLoading}
            >
              {actionLoading ? 'Booking...' : 'Yes, Book Room'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setBookModalOpen(false)}
              disabled={actionLoading}
            >
              No, Go back
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Release Room Modal */}
      <Dialog open={releaseModalOpen} onOpenChange={() => setReleaseModalOpen(false)}>
        <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
          <div className="p-8 bg-[#FFF1F2] rounded-full grid place-items-start">
            <LogOut size={100} className="text-[#ED1522]" />
          </div>
          <DialogTitle className="text-2xl">Release Room?</DialogTitle>
          <DialogDescription className="text-center text-md">
            Are you sure you want to release room <strong>{selectedRoom?.service_number}</strong>? This will make it available for new bookings.
          </DialogDescription>

          <div className="grid space-y-2">
            <Button 
              variant="destructive" 
              onClick={() => selectedRoom && releaseRoom(selectedRoom)}
              disabled={actionLoading}
            >
              {actionLoading ? 'Releasing...' : 'Yes, Release Room'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setReleaseModalOpen(false)}
              disabled={actionLoading}
            >
              No, Go back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}