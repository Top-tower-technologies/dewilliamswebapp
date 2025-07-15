"use client"
import MainLayout from '@/components/layout/MainLayout'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DynamicTable } from '@/components/reusable/GuestTable'
import { GuestDetailsCard } from '@/components/reusable/GuestDetailsCard'
import axiosInstance from '@/api/axiosInstance'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TriangleAlert, CheckCircle, User, LogIn, LogOut, CreditCard, Clock, X } from 'lucide-react'

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
  created_at: string;
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
  created_at: string;
  price: string;
  status: string;
  guest_id: string;
  occupancy: number;
}

interface ActionItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

const page = () => {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  // Modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [checkinModalOpen, setCheckinModalOpen] = useState(false)
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<TableData | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const columns = [
    { key: 'id', header: 'Booking ID', cellClassName: 'font-medium' },
    { key: 'name', header: 'Full Name' },
    { key: 'number', header: 'Phone Number' },
    { key: 'roomNo', header: 'Room No' },
    { key: 'created_at', header: 'Issue date and time' },
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
          case 'deposited': return 'secondary';
          case 'expired': return 'destructive';
          case 'checked_in': return 'default';
          case 'checked_out': return 'outline';
          case 'pending': return 'secondary';
          default: return 'outline';
        }
      }
    }
  ];

  // Dynamic actions based on status
  const getActionsForStatus = (status: string): ActionItem[] => {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case 'initiated':
        return [
          { key: 'confirm', label: 'Confirm Booking', icon: <CheckCircle size={16} />, variant: 'default' },
          { key: 'cancel', label: 'Cancel Booking', icon: <X size={16} />, variant: 'destructive' },
        ];

      case 'confirmed':
        return [
          { key: 'checkin', label: 'Check In', icon: <LogIn size={16} />, variant: 'default' },
          { key: 'cancel', label: 'Cancel Booking', icon: <X size={16} />, variant: 'destructive' },
        ];

      case 'pending':
        return [
          { key: 'payment', label: 'Make Payment', icon: <CreditCard size={16} />, variant: 'default' },
          // { key: 'cancel', label: 'Cancel Booking', icon: <X size={16} />, variant: 'destructive' },
        ];

      case 'deposited':
        return [
          { key: 'confirm', label: 'Confirm Booking', icon: <CheckCircle size={16} />, variant: 'default' },
        ];

      case 'checked_in':
        return [
          { key: 'checkout', label: 'Check Out', icon: <LogOut size={16} />, variant: 'default' },
        ];

      case 'cancelled':
      case 'expired':
      case 'checked_out':
      default:
        return [];
    }
  };

  // Transform API data to match table structure
  const transformApiData = (apiData: ApiBookingData[]): TableData[] => {
    return apiData.map(item => ({
      id: item.booking_id,
      name: item.full_name,
      number: item.phone,
      roomNo: item.service_no,
      created_at: item.created_at.slice(0, 10), // Format date to YYYY-MM-DD HH:mm
      price: `₦${parseFloat(item.total_amount).toLocaleString()}`,
      status: item.status,
      guest_id: item.guest_id,
      occupancy: item.occupancy
    }));
  };

  // Fetch reservations data
  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axiosInstance.get(`/staff/reservations?page=1&limit=8`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      });

      console.log(response.data);

      if (response.data.success && response.data.data) {
        const transformedData = transformApiData(response.data.data.data);
        setBookingData(transformedData);

        // Update pagination info
        setPaginationInfo({
          currentPage: response.data.data.pagination.page,
          totalPages: response.data.data.pagination.totalPages,
          totalItems: response.data.data.pagination.total,
          itemsPerPage: response.data.data.pagination.limit
        });
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

  // Handle page changes from the table
  const handlePageChange = () => {
    fetchReservations();
  };

  // Action Functions
  const confirmBooking = async (booking: TableData) => {
    try {
      setActionLoading(true);
      const response = await axiosInstance.post(`/staff/bookings/${booking.id}/confirm`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      });

      if (response.data.success) {
        // console.log('Booking confirmed successfully');
        await fetchReservations();
        setConfirmModalOpen(false);
        setSelectedBooking(null);
      } else {
        throw new Error(response.data.message || 'Failed to confirm booking');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      setError('Failed to confirm booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelBooking = async (booking: TableData) => {
    try {
      setActionLoading(true);
      const response = await axiosInstance.post(`/staff/guests/${booking.guest_id}/checkout/${booking.id}`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      });

      if (response.data.success) {
        // console.log('Booking cancelled successfully');
        await fetchReservations();
        setCancelModalOpen(false);
        setSelectedBooking(null);
      } else {
        throw new Error(response.data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const checkoutGuest = async (booking: TableData) => {
    try {
      setActionLoading(true);
      const response = await axiosInstance.post(`/staff/guests/${booking.guest_id}/checkout/${booking.id}`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      });

      if (response.data.success) {
        // console.log('Guest checked out successfully');
        await fetchReservations();
        setCheckoutModalOpen(false);
        setSelectedBooking(null);
      } else {
        throw new Error(response.data.message || 'Failed to check out guest');
      }
    } catch (error) {
      console.error('Error checking out guest:', error);
      setError('Failed to check out guest. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchReservations(); // Start with page 1
  }, []);

  // Handle row actions
  const handleRowAction = async (actionKey: string, item: TableData, index: number) => {
    // console.log(`Action: ${actionKey}`, item);

    setSelectedBooking(item);

    switch (actionKey) {
      case 'confirm':
        setConfirmModalOpen(true);
        break;

      case 'cancel':
        setCancelModalOpen(true);
        break;

      case 'checkin':
        setCheckinModalOpen(true);
        break;

      case 'checkout':
        setCheckoutModalOpen(true);
        break;

      case 'details':
        // console.log(`Viewing details for ${item.name}`);
        router.push(`/dashboard/bookings/${item.id}`);
        break;

      default:
        // console.log(`Unknown action: ${actionKey}`);
        break;
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
          case 'deposited': return 'bg-purple-100 text-purple-800';
          case 'expired': return 'bg-gray-100 text-gray-800';
          case 'checked_in': return 'bg-blue-100 text-blue-800';
          case 'checked_out': return 'bg-gray-100 text-gray-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      };

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
        </span>
      );
    }
    return item[column.key as keyof TableData];
  };

  // Show loading state
  if (loading && bookingData.length === 0) {
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
  if (error && bookingData.length === 0) {
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
                onClick={() => fetchReservations()}
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
            actions={(row: TableData) => getActionsForStatus(row.status)}
            paginationInfo={paginationInfo}
            onPageChange={handlePageChange}
            showCheckbox={true}
            showActions={true}
            onRowAction={handleRowAction}
            renderCell={renderCell}
            loading={loading}
            itemsPerPage={10}
          />
        </GuestDetailsCard>

        {/* All your modals remain the same */}
        {/* Cancel Booking Modal */}
        <Dialog open={cancelModalOpen} onOpenChange={() => setCancelModalOpen(false)}>
          <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
            <div className="p-8 bg-[#FFF1F2] rounded-full grid place-items-start">
              <TriangleAlert size={100} className="text-[#ED1522]" />
            </div>
            <DialogTitle className="text-2xl">Cancel Booking?</DialogTitle>
            <DialogDescription className="text-center text-md">
              Are you sure you want to cancel the booking for <strong>{selectedBooking?.name}</strong>?
              This action cannot be reversed.
            </DialogDescription>

            <div className="grid space-y-2">
              <Button
                variant="destructive"
                onClick={() => selectedBooking && cancelBooking(selectedBooking)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCancelModalOpen(false)}
                disabled={actionLoading}
              >
                No, Go back
              </Button>
            </div>
          </DialogContent>
        </Dialog>


        {/* Confirm Booking Modal */}
        <Dialog open={confirmModalOpen} onOpenChange={() => setConfirmModalOpen(false)}>
          <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
            <div className="p-8 bg-[#F0F9FF] rounded-full grid place-items-start">
              <CheckCircle size={100} className="text-[#0369A1]" />
            </div>
            <DialogTitle className="text-2xl">Confirm Booking?</DialogTitle>
            <DialogDescription className="text-center text-md">
              Are you sure you want to confirm the booking for <strong>{selectedBooking?.name}</strong>?
              Room {selectedBooking?.roomNo} will be reserved.
            </DialogDescription>

            <div className="grid space-y-2">
              <Button
                onClick={() => selectedBooking && confirmBooking(selectedBooking)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Confirming...' : 'Yes, Confirm Booking'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConfirmModalOpen(false)}
                disabled={actionLoading}
              >
                No, Go back
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Check In Modal */}
        <Dialog open={checkinModalOpen} onOpenChange={() => setCheckinModalOpen(false)}>
          <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
            <div className="p-8 bg-[#F0FDF4] rounded-full grid place-items-start">
              <LogIn size={100} className="text-[#15803D]" />
            </div>
            <DialogTitle className="text-2xl">Check In Guest?</DialogTitle>
            <DialogDescription className="text-center text-md">
              Are you sure you want to check in <strong>{selectedBooking?.name}</strong> to room {selectedBooking?.roomNo}?
            </DialogDescription>

            <div className="grid space-y-2">
              <Button
                onClick={() => router.push("/dashboard/reservation")}
                disabled={actionLoading}
              >
                {actionLoading ? 'Checking In...' : 'Yes, Check In'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCheckinModalOpen(false)}
                disabled={actionLoading}
              >
                No, Go back
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Check Out Modal */}
        <Dialog open={checkoutModalOpen} onOpenChange={() => setCheckoutModalOpen(false)}>
          <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
            <div className="p-8 bg-[#FEF3C7] rounded-full grid place-items-start">
              <LogOut size={100} className="text-[#D97706]" />
            </div>
            <DialogTitle className="text-2xl">Check Out Guest?</DialogTitle>
            <DialogDescription className="text-center text-md">
              Are you sure you want to check out <strong>{selectedBooking?.name}</strong> from room {selectedBooking?.roomNo}?
            </DialogDescription>

            <div className="grid space-y-2">
              <Button
                onClick={() => selectedBooking && checkoutGuest(selectedBooking)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Checking Out...' : 'Yes, Check Out'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCheckoutModalOpen(false)}
                disabled={actionLoading}
              >
                No, Go back
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}

export default page