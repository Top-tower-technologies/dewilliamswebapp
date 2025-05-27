"use client"
import MainLayout from '@/components/layout/MainLayout'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DynamicTable } from '@/components/reusable/GuestTable'
import { GuestDetailsCard } from '@/components/reusable/GuestDetailsCard'
import axiosInstance from '@/api/axiosInstance'

// Define types for better type safety
interface ApiBookingData {
  guest_id: string;
  full_name: string;
  booking_id: string;
  service_no: string;
  phone: string;
  total_amount: string;
  occupancy: number;
  status: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: ApiBookingData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  success: boolean;
}

interface TableData {
  id: string;
  name: string;
  number: string;
  roomNo: string;
  dateandtime: string;
  price: string;
  status: string;
  guest_id: string;
  occupancy: number;
}

const page = () => {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const columns = [
    { key: 'id', header: 'Booking ID', cellClassName: 'font-medium' },
    { key: 'name', header: 'Full Name' },
    { key: 'number', header: 'Phone Number' },
    { key: 'roomNo', header: 'Room No' },
    { key: 'dateandtime', header: 'Issue date and time' },
    { key: 'price', header: 'Total Amount' },
    {
      key: 'status',
      header: 'Reservation',
      type: 'badge',
      badgeVariant: (status: string) => {
        switch (status.toLowerCase()) {
          case 'confirmed': return 'default';
          case 'initiated': return 'secondary';
          case 'cancelled': return 'destructive';
          case 'completed': return 'outline';
          default: return 'outline';
        }
      }
    }
  ];

  const actions = [
    { key: 'confirm', label: 'Confirm Booking' },
    { key: 'cancel', label: 'Cancel Booking' },
    { key: 'details', label: 'View Details' }
  ];

  // Transform API data to match table structure
  const transformApiData = (apiData: ApiBookingData[]): TableData[] => {
    return apiData.map(item => ({
      id: item.booking_id,
      name: item.full_name,
      number: item.phone,
      roomNo: item.service_no,
      dateandtime: new Date().toLocaleDateString(), // You might want to add actual date from API
      price: `₦${parseFloat(item.total_amount).toLocaleString()}`,
      status: item.status,
      guest_id: item.guest_id,
      occupancy: item.occupancy
    }));
  };

  // Fetch reservations data
  const fetchReservations = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axiosInstance.get(`/staff/reservations?page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      });
      
      console.log(response.data);
      
      if (response.data.success && response.data.data) {
        const transformedData = transformApiData(response.data.data.data);
        setBookingData(transformedData);
        setTotalPages(response.data.data.pagination.totalPages);
        setCurrentPage(response.data.data.pagination.page);
      } else {
        throw new Error(response.data.message || 'Failed to fetch reservations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchReservations(currentPage);
  }, [currentPage]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle row actions
  const handleRowAction = async (actionKey: string, item: TableData, index: number) => {
    console.log(`Action: ${actionKey}`, item);
    
    try {
      switch (actionKey) {
        case 'confirm':
          console.log(`Confirming booking for ${item.name}`);
          // Add API call to confirm booking
          // await confirmBooking(item.id);
          // Refresh data after action
          // await fetchReservations(currentPage);
          break;
          
        case 'cancel':
          console.log(`Cancelling booking for ${item.name}`);
          // Add API call to cancel booking
          // await cancelBooking(item.id);
          // Refresh data after action
          // await fetchReservations(currentPage);
          break;
          
        case 'details':
          console.log(`Viewing details for ${item.name}`);
          // Navigate to details page
          router.push(`/dashboard/bookings/${item.id}`);
          break;
          
        default:
          console.log(`Unknown action: ${actionKey}`);
          break;
      }
    } catch (err) {
      console.error(`Error executing action ${actionKey}:`, err);
      // You might want to show a toast notification here
    }
  };

  // Custom cell renderer
  const renderCell = (item: TableData, column: any) => {
    if (column.key === 'status') {
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case 'confirmed': return 'bg-green-100 text-green-800';
          case 'initiated': return 'bg-yellow-100 text-yellow-800';
          case 'cancelled': return 'bg-red-100 text-red-800';
          case 'completed': return 'bg-blue-100 text-blue-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      };

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      );
    }
    return item[column.key as keyof TableData];
  };

  // Show loading state
  if (loading) {
    return (
      <MainLayout navigation={<p className='text-[20px] font-[400]'>Booking</p>} buttonText={"New Booking"} handleClick={() => router.push("/dashboard/bookings/new-booking")}>
        <div className='p-4'>
          <GuestDetailsCard>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <span className="ml-4">Loading reservations...</span>
            </div>
          </GuestDetailsCard>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout navigation={<p className='text-[20px] font-[400]'>Booking</p>} buttonText={"New Booking"} handleClick={() => router.push("/dashboard/bookings/new-booking")}>
        <div className='p-4'>
          <GuestDetailsCard>
            <div className="flex flex-col justify-center items-center h-64">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={() => fetchReservations(currentPage)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </GuestDetailsCard>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={<p className='text-[20px] font-[400]'>Booking</p>} buttonText={"New Booking"} handleClick={() => router.push("/dashboard/bookings/new-booking")}>
      <div className='p-4'>
        <GuestDetailsCard>

          <DynamicTable
            columns={columns}
            data={bookingData}
            actions={actions}
            itemsPerPage={10}
            showCheckbox={true}
            showActions={true}
            onRowAction={handleRowAction}
            renderCell={renderCell}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </GuestDetailsCard>
      </div>
    </MainLayout>
  )
}

export default page