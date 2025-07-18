"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { DynamicTable } from '@/components/reusable/GuestTable'
import { GuestDetailsCard } from '@/components/reusable/GuestDetailsCard'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TriangleAlert, CheckCircle, LogIn, LogOut, CreditCard, X } from 'lucide-react'
import axiosInstance from '@/api/axiosInstance'
import { set } from 'date-fns'
import { parseCurrency } from '@/components/reusable/FormatCurrency'
import { PosForm } from '@/components/reusable/PosForm'

// ====== TYPE DEFINITIONS ======
interface ApiBookingData {
  guest_id: string
  full_name: string
  booking_id: string
  service_no: string
  phone: string
  total_amount: string
  occupancy: number
  status: string
  created_at: string
  transaction_ref: string
}
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  iconBg: string;
  icon: React.ReactNode;
  actionLoading?: boolean;
}

interface ApiResponse {
  statusCode: number
  message: string
  data: {
    data: ApiBookingData[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
  success: boolean
}

interface BookingData {
  id: string
  name: string
  number: string
  roomNo: string
  created_at: string
  price: string
  status: string
  guest_id: string
  occupancy: number
  transaction_ref: string
}

interface ActionItem {
  key: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

// ====== CONSTANTS ======
const ITEMS_PER_PAGE = 10

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-800',
  initiated: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  deposited: 'bg-purple-100 text-purple-800',
  expired: 'bg-gray-100 text-gray-800',
  checked_in: 'bg-blue-100 text-blue-800',
  checked_out: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  default: 'bg-gray-100 text-gray-800'
} as const

const BADGE_VARIANTS = {
  confirmed: 'default',
  initiated: 'secondary',
  cancelled: 'destructive',
  completed: 'outline',
  deposited: 'secondary',
  expired: 'destructive',
  checked_in: 'default',
  checked_out: 'outline',
  pending: 'secondary',
  default: 'outline'
} as const

// ====== UTILITY FUNCTIONS ======
const getActionsForStatus = (status: string): ActionItem[] => {
  const normalizedStatus = status.toLowerCase()

  const actionMap: Record<string, ActionItem[]> = {
    initiated: [
      { key: 'payment', label: 'Make Payment', icon: <CreditCard size={16} />, variant: 'default' },
      { key: 'confirm', label: 'Confirm Booking', icon: <CheckCircle size={16} />, variant: 'default' },
    ],
    confirmed: [
      { key: 'checkin', label: 'Check In', icon: <LogIn size={16} />, variant: 'default' },
      { key: 'cancel', label: 'Cancel Booking', icon: <X size={16} />, variant: 'destructive' }
    ],
    pending: [
      { key: 'payment', label: 'Make Payment', icon: <CreditCard size={16} />, variant: 'default' }
    ],
    deposited: [
      { key: 'confirm', label: 'Confirm Booking', icon: <CheckCircle size={16} />, variant: 'default' }
    ],
    checked_in: [
      { key: 'checkout', label: 'Check Out', icon: <LogOut size={16} />, variant: 'default' }
    ]
  }

  return actionMap[normalizedStatus] || []
}

const transformApiData = (apiData: ApiBookingData[]): BookingData[] => {
  return apiData.map(item => ({
    id: item.booking_id,
    name: item.full_name,
    number: item.phone,
    roomNo: item.service_no,
    created_at: item.created_at.slice(0, 10),
    price: `₦${parseFloat(item.total_amount).toLocaleString()}`,
    status: item.status,
    guest_id: item.guest_id,
    occupancy: item.occupancy,
    transaction_ref: item.transaction_ref
  }))
}

const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status.toLowerCase() as keyof typeof STATUS_COLORS] || STATUS_COLORS.default
}

const formatStatusDisplay = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}

// ====== CUSTOM HOOKS ======
const useBookingActions = (fetchReservations: () => Promise<void>) => {
  const [actionLoading, setActionLoading] = useState(false)

  const executeAction = async (action: () => Promise<void>) => {
    try {
      setActionLoading(true)
      await action()
      await fetchReservations()
    } catch (error) {
      console.error('Action failed:', error)
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  const confirmBooking = async (bookingId: string) => {
    await executeAction(async () => {
      const response = await axiosInstance.post(`/staff/bookings/${bookingId}/confirm`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      })
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to confirm booking')
      }
    })
  }

  const cancelBooking = async (id: string) => {
    await executeAction(async () => {
      const response = await axiosInstance.patch(`/staff/reservations/${id}/cancel`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      })
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to cancel booking')
      }
    })
  }

  const checkoutGuest = async (guestId: string, bookingId: string) => {
    await executeAction(async () => {
      const response = await axiosInstance.post(`/staff/guests/${guestId}/checkout/${bookingId}`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      })
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to check out guest')
      }
    })
  }

  return { confirmBooking, cancelBooking, checkoutGuest, actionLoading }
}

// ====== MAIN COMPONENT ======
const BookingPage: React.FC = () => {
  const router = useRouter()

  // Data state
  const [bookingData, setBookingData] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: ITEMS_PER_PAGE
  })

  // Modal states
  const [modals, setModals] = useState({
    cancel: false,
    confirm: false,
    checkin: false,
    checkout: false,
    pos: false
  })

  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [posData, setPosData] = useState({
    serviceId: undefined as number | undefined,
    totalAmount: undefined as number | undefined,
    transactionRef: undefined as string | undefined
  })

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axiosInstance.get(`/staff/reservations?page=1&limit=8`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      })

      if (response.data.success && response.data.data) {
        const transformedData = transformApiData(response.data.data.data)
        setBookingData(transformedData)

        setPaginationInfo({
          currentPage: response.data.data.pagination.page,
          totalPages: response.data.data.pagination.totalPages,
          totalItems: response.data.data.pagination.total,
          itemsPerPage: response.data.data.pagination.limit
        })
      } else {
        throw new Error(response.data.message || 'Failed to fetch reservations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data')
      console.error('Error fetching reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  const { confirmBooking, cancelBooking, checkoutGuest, actionLoading } = useBookingActions(fetchReservations)

  // Modal handlers
  const openModal = (modalType: keyof typeof modals, booking?: BookingData) => {
    if (booking) setSelectedBooking(booking)
    setModals(prev => ({ ...prev, [modalType]: true }))
  }

  const closeModal = (modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: false }))
    if (modalType !== 'pos') setSelectedBooking(null)
  }

  // Action handlers
  const handleRowAction = (actionKey: string, item: BookingData) => {
    setSelectedBooking(item)

    switch (actionKey) {
      case 'confirm':
        openModal('confirm', item)
        break
      case 'cancel':
        openModal('cancel', item)
        break
      case 'checkin':
        openModal('checkin', item)
        break
      case 'checkout':
        openModal('checkout', item)
        break
      case 'payment':
        setPosData({
          serviceId: item.roomNo ? parseInt(item.roomNo) : undefined,
          totalAmount: item.price ? parseCurrency(item.price) : undefined,
          transactionRef: item.transaction_ref || undefined
        })
        console.log("POS Data:", item)
        openModal('pos', item)
        break
      case 'details':
        router.push(`/dashboard/bookings/${item.id}`)
        break
      default:
        console.warn(`Unknown action: ${actionKey}`)
    }
  }

  const handleActionConfirm = async (actionType: string) => {
    if (!selectedBooking) return

    try {
      switch (actionType) {
        case 'confirm':
          await confirmBooking(selectedBooking.id)
          closeModal('confirm')
          break
        case 'cancel':
          await cancelBooking(selectedBooking.id)
          closeModal('cancel')
          break
        case 'checkout':
          await checkoutGuest(selectedBooking.guest_id, selectedBooking.id)
          closeModal('checkout')
          break
        case 'checkin':
          router.push("/dashboard/reservation")
          break
      }
    } catch (error) {
      setError(`Failed to ${actionType} booking. Please try again.`)
    }
  }

  // Table configuration
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
      badgeVariant: (status: string) => BADGE_VARIANTS[status.toLowerCase() as keyof typeof BADGE_VARIANTS] || BADGE_VARIANTS.default
    }
  ]

  const renderCell = (item: BookingData, column: any) => {
    if (column.key === 'status') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {formatStatusDisplay(item.status)}
        </span>
      )
    }
    return item[column.key as keyof BookingData]
  }
  // Effects
  useEffect(() => {
    fetchReservations()
  }, [])

  // Loading state
  if (loading && bookingData.length === 0) {
    return (
      <MainLayout
        navigation={<p className='text-[20px] font-[400]'>Booking</p>}
        buttonText="New Booking"
        handleClick={() => router.push("/dashboard/bookings/new-booking")}
      >
        <div className='p-4'>
          <GuestDetailsCard>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <span className="ml-4">Loading reservations...</span>
            </div>
          </GuestDetailsCard>
        </div>
      </MainLayout>
    )
  }

  // Error state
  if (error && bookingData.length === 0) {
    return (
      <MainLayout
        navigation={<p className='text-[20px] font-[400]'>Booking</p>}
        buttonText="New Booking"
        handleClick={() => router.push("/dashboard/bookings/new-booking")}
      >
        <div className='p-4'>
          <GuestDetailsCard>
            <div className="flex flex-col justify-center items-center h-64">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={fetchReservations}>Retry</Button>
            </div>
          </GuestDetailsCard>
        </div>
      </MainLayout>
    )
  }

  const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    iconBg,
    icon,
    actionLoading = false,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-9 space-y-3">
          <div className={`p-8 ${iconBg} rounded-full grid place-items-start w-1/2 mx-auto`}>
            {icon}
          </div>
          <h2 className="text-2xl font-semibold text-center">{title}</h2>
          <p className="text-center text-md text-gray-600">{description}</p>
          <div className="grid space-y-2">
            <Button onClick={onConfirm} disabled={actionLoading}>
              {actionLoading ? "Processing..." : confirmText}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={actionLoading}>
              No, Go back
            </Button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <MainLayout
      navigation={<p className='text-[20px] font-[400]'>Booking</p>}
      buttonText="New Booking"
      handleClick={() => router.push("/dashboard/bookings/new-booking")}
    >
      <div className='p-4'>
        <GuestDetailsCard>
          <DynamicTable
            columns={columns}
            data={bookingData}
            actions={(row: BookingData) => getActionsForStatus(row.status)}
            paginationInfo={paginationInfo}
            onPageChange={fetchReservations}
            showCheckbox={true}
            showActions={true}
            onRowAction={handleRowAction}
            renderCell={renderCell}
            loading={loading}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </GuestDetailsCard>

        {/* Modals */}
        <ConfirmationModal
          isOpen={modals.cancel}
          onClose={() => closeModal('cancel')}
          onConfirm={() => handleActionConfirm('cancel')}
          title="Cancel Booking?"
          description={`Are you sure you want to cancel the booking for ${selectedBooking?.name}? This action cannot be reversed.`}
          confirmText="Yes, Cancel Booking"
          iconBg="bg-[#FFF1F2]"
          icon={<TriangleAlert size={100} className="text-[#ED1522]" />}
        />

        <ConfirmationModal
          isOpen={modals.confirm}
          onClose={() => closeModal('confirm')}
          onConfirm={() => router.push('/dashboard/reservation')}
          title="Confirm Booking?"
          description={`Are you sure you want to confirm the booking for ${selectedBooking?.name}? Room ${selectedBooking?.roomNo} will be reserved.`}
          confirmText="Yes, Confirm Booking"
          iconBg="bg-[#F0F9FF]"
          icon={<CheckCircle size={100} className="text-[#0369A1]" />}
        />

        <ConfirmationModal
          isOpen={modals.checkin}
          onClose={() => closeModal('checkin')}
          onConfirm={() => router.push('/dashboard/reservation')}
          title="Check In Guest?"
          description={`Are you sure you want to check in ${selectedBooking?.name} to room ${selectedBooking?.roomNo}?`}
          confirmText="Yes, Check In"
          iconBg="bg-[#F0FDF4]"
          icon={<LogIn size={100} className="text-[#15803D]" />}
        />

        <ConfirmationModal
          isOpen={modals.checkout}
          onClose={() => closeModal('checkout')}
          onConfirm={() => router.push('/dashboard/reservation')}
          title="Check Out Guest?"
          description={`Are you sure you want to check out ${selectedBooking?.name} from room ${selectedBooking?.roomNo}?`}
          confirmText="Yes, Check Out"
          iconBg="bg-[#FEF3C7]"
          icon={<LogOut size={100} className="text-[#D97706]" />}
        />

        <PosForm
          posDialogOpen={modals.pos}
          serviceId={posData.serviceId}
          setPosDialogOpen={(open: any) => setModals(prev => ({ ...prev, pos: open }))}
          totalAmount={posData.totalAmount}
          transactionRef={posData.transactionRef}
        />
      </div>
    </MainLayout>
  )
}

export default BookingPage