"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // For App Router
// import { useRouter } from 'next/router'; // For Pages Router (alternative)
import { ChevronLeft } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';
import { useRouter } from 'next/navigation'


const BookingDetails = () => {
    // Get the booking ID from URL parameters
    const params = useParams();
    const bookingId = params?.id as string; // This will capture the dynamic segment

    // Alternative for Pages Router:
    const router = useRouter();
    // const { bookingId } = router.query;

    const [booking, setBooking] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API call to fetch booking details
    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId) {
                setError('Booking ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axiosInstance.get(`/staff/reservations/${bookingId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('AuthKey')}` },
                });

                if (response.data) {
                    setBooking(response.data);
                } else {
                    setError('No booking data found');
                }
            } catch (error: any) {
                console.error('Error fetching booking:', error);

                if (error.response?.status === 404) {
                    setError('Booking not found');
                } else if (error.response?.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError('Failed to fetch booking details. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    const formatCurrency = (amount: any) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: any) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'checked_out':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    // const handleCancelBooking = async () => {
    //     if (!booking?.id) return;

    //     try {
    //         const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    //         if (!confirmed) return;

    //         const response = await axiosInstance.put(`/staff/reservations/${booking.id}/cancel`);

    //         if (response.status === 200) {
    //             setBooking(prev => ({ ...prev, status: 'cancelled' }));
    //             alert('Booking cancelled successfully');
    //         }
    //     } catch (error) {
    //         console.error('Error cancelling booking:', error);
    //         alert('Failed to cancel booking. Please try again.');
    //     }
    // };

    const handleSendReminder = async () => {
        if (!booking?.id) return;

        try {
            const response = await axiosInstance.post(`/staff/reservations/${booking.id}/reminder`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('AuthKey')}` },
            });

            if (response.status === 200) {
                alert('Booking reminder sent successfully');
            }
        } catch (error) {
            console.error('Error sending reminder:', error);
            alert('Failed to send reminder. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="bg-white rounded-lg p-6 space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Booking</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
                    <p className="text-gray-600">The requested booking could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => router.back()}>
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                                    <span>Booking</span>
                                    <span>›</span>
                                    <span>Booking details</span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => router.push('/dashboard/reservation')}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Cancel Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Guest Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Guest Profile */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                                    OS
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {booking.guest_details[0]?.name || 'Guest Name'}
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-pink-500 text-sm">
                                            Reserved for {formatDate(booking.check_in)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Info Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Guest ID</label>
                                        <p className="font-medium">{booking.reservation_code}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Booking Status</label>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Booking ID</label>
                                        <p className="font-medium">{booking.booking_id}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Total Amount</label>
                                        <p className="font-medium">{formatCurrency(booking.total_amount)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Phone Number</label>
                                        <p className="font-medium">{booking.guest_details?.[0]?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Room Name</label>
                                        <p className="font-medium">{booking.service?.room_name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Reference No</label>
                                        <p className="font-medium">#{booking.transaction_ref?.slice(-8)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Check-in Date</label>
                                        <p className="font-medium">{formatDate(booking.check_in)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Nights</label>
                                        <p className="font-medium">{booking.nights} night{booking.nights !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Issue date & time</label>
                                        <p className="font-medium">{formatDate(booking.created_at)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Check-out Date</label>
                                        <p className="font-medium">{formatDate(booking.check_out)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Guests</label>
                                        <p className="font-medium">
                                            {booking.guests.adult} Adult{booking.guests.adult !== 1 ? 's' : ''}
                                            {booking.guests.children > 0 && `, ${booking.guests.children} Child${booking.guests.children !== 1 ? 'ren' : ''}`}
                                            {booking.guests.infant > 0 && `, ${booking.guests.infant} Infant${booking.guests.infant !== 1 ? 's' : ''}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">{booking.nights} Night{booking.nights !== 1 ? 's' : ''}</span>
                                    <span className="font-medium">{formatCurrency(booking.price_breakdown.base_price)}</span>
                                </div>

                                {booking.price_breakdown.additional_guest_charges > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Additional Guests</span>
                                        <span className="font-medium">{formatCurrency(booking.price_breakdown.additional_guest_charges)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">V.A.T</span>
                                    <span className="font-medium">{formatCurrency(booking.price_breakdown.taxes)}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Subtotal</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(booking.total_amount)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSendReminder}
                                className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Send Booking Reminder
                            </button>
                        </div>

                        {/* Room Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Room ID:</span>
                                    <span className="font-medium">{booking.service?.inventory_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bedrooms:</span>
                                    <span className="font-medium">{booking.service?.no_of_bedrooms}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Beds:</span>
                                    <span className="font-medium">{booking.service?.no_of_beds}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bathrooms:</span>
                                    <span className="font-medium">{booking.service?.no_of_bathrooms}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Max Guests:</span>
                                    <span className="font-medium">{booking.service?.max_guest_no}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;