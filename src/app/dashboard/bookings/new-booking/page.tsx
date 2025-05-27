"use client"
import MainLayout from '@/components/layout/MainLayout'
import { ArrowRight, ChevronLeftCircle, ChevronRight, Calendar, User, Mail, Phone, MapPin, Tag, MessageSquare, Users, Baby, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axiosInstance from '@/api/axiosInstance';
import Toast from '@/components/reusable/Toast';
import { PaymentModal } from '@/components/reusable/PaymentModal';

interface Room {
    id: string;
    name: string;
    service_number: string;
    room_type: string;
    standard_NGN_price: number;
    currency: string;
    availability_status: string;
}

interface BookingData {
    check_in: string;
    check_out: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    guests: {
        adult: number;
        children: number;
        infant: number;
    };
    special_request?: string;
    reservation_source: string;
    address?: string;
}

interface ToastState {
    show: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
}

const NewBookingPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "success"
    });
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<any>({})

    const [bookingData, setBookingData] = useState<BookingData>({
        check_in: '',
        check_out: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        guests: {
            adult: 1,
            children: 0,
            infant: 0
        },
        special_request: '',
        reservation_source: 'walk_in',
        address: '',
    });

    // Toast helper function
    const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
        setToast({ show: true, message, type });
        // Auto-hide toast after 5 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    // Hide toast function
    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    // Fetch rooms on component mount
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axiosInstance.get(`/staff/services/room_service/list/view`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` },
                });
                console.log(response.data);
                setRooms(response.data.data);
            } catch (error: any) {
                console.error("Error fetching rooms:", error);
                showToast(error?.response?.data?.message || "Failed to fetch available rooms.", "error");
            }
        };

        fetchRooms();
    }, []);

    // Handle input changes
    const handleInputChange = (field: string, value: any) => {
        setBookingData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle guest count changes
    const handleGuestChange = (type: 'adult' | 'children' | 'infant', value: number) => {
        setBookingData(prev => ({
            ...prev,
            guests: {
                ...prev.guests,
                [type]: Math.max(0, value)
            }
        }));
    };

    // Handle room selection
    const handleRoomSelect = (roomId: string) => {
        const room = rooms.find(r => r.id === roomId);
        setSelectedRoom(room || null);
    };

    // Calculate booking summary
    const calculateNights = () => {
        if (!bookingData.check_in || !bookingData.check_out) return 0;
        const checkIn = new Date(bookingData.check_in);
        const checkOut = new Date(bookingData.check_out);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const nights = calculateNights();
    const roomPrice = selectedRoom?.standard_NGN_price || 0;
    const subtotal = nights * roomPrice;
    const vat = subtotal * 0.075; // 7.5% VAT
    const total = subtotal + vat;

    // Handle form submission
    const handleSubmit = async () => {
        // Validation
        if (!bookingData.check_in || !bookingData.check_out || !bookingData.first_name ||
            !bookingData.last_name || !bookingData.email || !bookingData.phone || !selectedRoom) {
            showToast("Validation Error: Please fill in all required fields and select a room.", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post(
                `/staff/reservations/room_service/${selectedRoom.id}/new?pay_now=true`,
                bookingData,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
                }
            );
            setPaymentModalOpen(true)
            showToast("Booking created successfully!", "success");
            //this is what i changed
            setPaymentDetails(response.data.data)
            console.log("Booking response:", response.data.data);


        } catch (error: any) {
            console.error("Error creating booking:", error);
            showToast(error.response?.data?.message || "Failed to create booking.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        setBookingData({
            check_in: '',
            check_out: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            guests: { adult: 1, children: 0, infant: 0 },
            special_request: '',
            reservation_source: 'walk_in',
            address: '',
        });
        setSelectedRoom(null);
        showToast("Form has been reset", "info");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
            {/* Toast Component - Always rendered but conditionally visible */}
            <Toast
                message={toast.message}
                type={toast.type}
            />

            <MainLayout
                navigation={
                    <div className='flex justify-center gap-x-3 items-center backdrop-blur-sm bg-white/70 rounded-full px-6 py-2 shadow-sm border'>
                        <Link href={"/dashboard/bookings"}>
                            <ChevronLeftCircle className='text-gray-400 hover:text-yellow-600 transition-colors duration-200' size={30} />
                        </Link>
                        <p className='text-[20px] font-[400] text-gray-500'>Booking</p>
                        <ChevronRight className="text-gray-300" size={20} />
                        <p className='text-[20px] font-[400] text-yellow-600'>New Booking</p>
                    </div>
                }
                buttonText=""
                buttonVisible={true}
            >
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {/* Booking Details */}
                    <Card className="lg:col-span-2 backdrop-blur-sm bg-white/80 shadow-xl">
                        <CardHeader className='flex flex-row justify-between items-center bg-gray-50 rounded-t-lg'>
                            <CardTitle className="text-2xl font-bold text-gray-800">Booking Details</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleReset} className=" text-yellow-700 hover:bg-yellow-50">
                                    Reset
                                </Button>
                                <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                                    Cancel Booking
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6 p-6">
                            {/* Check-in Details */}
                            <div className='rounded-xl border overflow-hidden shadow-sm'>
                                <div className='px-4 py-3 bg-gray-100 border-b '>
                                    <p className="font-semibold text-gray-700 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-yellow-600" />
                                        Check-in Details
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Check In *</label>
                                        <Input
                                            type="date"
                                            value={bookingData.check_in}
                                            onChange={(e) => handleInputChange('check_in', e.target.value)}
                                            className=" focus:border-yellow-400 focus:ring-yellow-400/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Check Out *</label>
                                        <Input
                                            type="date"
                                            value={bookingData.check_out}
                                            onChange={(e) => handleInputChange('check_out', e.target.value)}
                                            className=" focus:border-yellow-400 focus:ring-yellow-400/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Reservation Source *</label>
                                        <Select value={bookingData.reservation_source} onValueChange={(value) => handleInputChange('reservation_source', value)}>
                                            <SelectTrigger className=" focus:border-yellow-400">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="walk_in">Walk In</SelectItem>
                                                <SelectItem value="phone">Phone</SelectItem>
                                                <SelectItem value="website">Website</SelectItem>
                                                <SelectItem value="third_party">Third Party</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Room Details */}
                            <div className='rounded-xl border overflow-hidden shadow-sm'>
                                <div className='px-4 py-3 bg-gray-100 border-b'>
                                    <p className="font-semibold text-gray-700">Room Details</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Available Rooms *</label>
                                        <Select onValueChange={handleRoomSelect} value={selectedRoom?.id || ""}>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Select a room" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rooms.map((room) => (
                                                    <SelectItem key={room.id} value={room.id}>
                                                        {room.name} - {room.service_number} (₦{room.standard_NGN_price}/night)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {selectedRoom && (
                                        <div className="bg-amber-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">Selected Room:</p>
                                            <p className="text-amber-800 font-semibold">{selectedRoom.name}</p>
                                            <p className="text-gray-600 text-sm">Room #{selectedRoom.service_number}</p>
                                            <p className="text-amber-700 font-medium">₦{selectedRoom.standard_NGN_price}/night</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Guest Detail */}
                            <div className='rounded-xl border overflow-hidden shadow-sm'>
                                <div className='px-4 py-3 bg-gray-100 border-b '>
                                    <p className="font-semibold text-gray-700 flex items-center gap-2">
                                        <User className="w-5 h-5 text-yellow-600" />
                                        Guest Details
                                    </p>
                                </div>
                                <div className="space-y-4 p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">First Name *</label>
                                            <Input
                                                value={bookingData.first_name}
                                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                                placeholder="Enter first name"
                                                className=" focus:border-yellow-400 focus:ring-yellow-400/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Last Name *</label>
                                            <Input
                                                value={bookingData.last_name}
                                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                                placeholder="Enter last name"
                                                className=" focus:border-yellow-400 focus:ring-yellow-400/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="email"
                                                    value={bookingData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    placeholder="Enter email address"
                                                    className="pl-10 focus:border-yellow-400 focus:ring-yellow-400/20"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number *</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    value={bookingData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    placeholder="Enter phone number"
                                                    className="pl-10 focus:border-yellow-400 focus:ring-yellow-400/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                value={bookingData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                placeholder="Enter address (optional)"
                                                className="pl-10 focus:border-yellow-400 focus:ring-yellow-400/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Discount Code</label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    value={''}
                                                    onChange={(e) => handleInputChange('discount_code', e.target.value)}
                                                    placeholder="Enter discount code"
                                                    className="pl-10 focus:border-yellow-400 focus:ring-yellow-400/20"
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-3">Guest Count</label>
                                            <div className="flex gap-2">
                                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                                    <UserPlus className="w-4 h-4 text-yellow-600" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGuestChange('adult', bookingData.guests.adult - 1)}
                                                        className="text-yellow-600 hover:text-yellow-800 px-1"
                                                    >-</button>
                                                    <span className="text-sm min-w-[20px] text-center">{bookingData.guests.adult}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGuestChange('adult', bookingData.guests.adult + 1)}
                                                        className="text-yellow-600 hover:text-yellow-800 px-1"
                                                    >+</button>
                                                </div>
                                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                                    <Users className="w-4 h-4 text-amber-600" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGuestChange('children', bookingData.guests.children - 1)}
                                                        className="text-amber-600 hover:text-amber-800 px-1"
                                                    >-</button>
                                                    <span className="text-sm min-w-[20px] text-center">{bookingData.guests.children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGuestChange('children', bookingData.guests.children + 1)}
                                                        className="text-amber-600 hover:text-amber-800 px-1"
                                                    >+</button>
                                                </div>
                                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                                    <Baby className="w-4 h-4 text-orange-600" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGuestChange('infant', bookingData.guests.infant - 1)}
                                                        className="text-orange-600 hover:text-orange-800 px-1"
                                                    >-</button>
                                                    <span className="text-sm min-w-[20px] text-center">{bookingData.guests.infant}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGuestChange('infant', bookingData.guests.infant + 1)}
                                                        className="text-orange-600 hover:text-orange-800 px-1"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Special Request</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Textarea
                                                value={bookingData.special_request}
                                                onChange={(e) => handleInputChange('special_request', e.target.value)}
                                                placeholder="Any special requests or notes..."
                                                className="pl-10 focus:border-yellow-400 focus:ring-yellow-400/20 min-h-[80px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Summary */}
                    <Card className="backdrop-blur-sm bg-white/80 shadow-xl sticky top-6">
                        <CardHeader className="bg-gray-100 rounded-t-lg">
                            <CardTitle className="text-xl font-bold text-gray-800">Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            {/* Guest Information */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700 border-b pb-1">Guest Information</h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Name:</span> {bookingData.first_name} {bookingData.last_name}</p>
                                    {bookingData.email && <p><span className="font-medium">Email:</span> {bookingData.email}</p>}
                                    {bookingData.phone && <p><span className="font-medium">Phone:</span> {bookingData.phone}</p>}
                                    {bookingData.address && <p><span className="font-medium">Address:</span> {bookingData.address}</p>}
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700 border-b pb-1">Booking Details</h4>
                                <div className="space-y-1 text-sm">
                                    {bookingData.check_in && <p><span className="font-medium">Check In:</span> {new Date(bookingData.check_in).toLocaleDateString()}</p>}
                                    {bookingData.check_out && <p><span className="font-medium">Check Out:</span> {new Date(bookingData.check_out).toLocaleDateString()}</p>}
                                    <p><span className="font-medium">Source:</span> {bookingData.reservation_source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                    <p><span className="font-medium">Guests:</span> {bookingData.guests.adult} Adult{bookingData.guests.adult !== 1 ? 's' : ''}{bookingData.guests.children > 0 ? `, ${bookingData.guests.children} Children` : ''}{bookingData.guests.infant > 0 ? `, ${bookingData.guests.infant} Infant${bookingData.guests.infant !== 1 ? 's' : ''}` : ''}</p>
                                    {/* {bookingData.discount_code && <p><span className="font-medium">Discount Code:</span> {bookingData.discount_code}</p>} */}
                                </div>
                            </div>

                            {/* Room & Pricing */}
                            {selectedRoom ? (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-700 border-b pb-1">Room & Pricing</h4>
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                        <p className="font-medium text-gray-700">{selectedRoom.name}</p>
                                        <p className="text-sm text-gray-600">Room #{selectedRoom.service_number}</p>
                                        <p className="text-sm text-gray-600">{selectedRoom.room_type}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{nights} Night{nights !== 1 ? 's' : ''}</span>
                                            <span>₦{roomPrice.toLocaleString()}/night</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>₦{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>VAT (7.5%)</span>
                                            <span>₦{vat.toLocaleString()}</span>
                                        </div>
                                        <hr className="" />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-yellow-600">₦{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Select a room to see pricing</p>
                                </div>
                            )}

                            {/* Special Requests */}
                            {bookingData.special_request && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-700 border-b pb-1">Special Requests</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{bookingData.special_request}</p>
                                </div>
                            )}

                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !selectedRoom}
                                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating Booking...
                                    </div>
                                ) : (
                                    "Create Booking"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>

<PaymentModal
    open={paymentModalOpen}
    onOpenChange={setPaymentModalOpen}
    paymentLink={paymentDetails.payment_link}
    email={paymentDetails?.guest?.email || ""}
    amount={paymentDetails?.total || 0}
    guestName={paymentDetails?.guest?.name || ""}
    onPaymentComplete={() => {
        console.log("Payment marked as complete");
        router.push('/dashboard/bookings')
    }}
/>
        </div>
    )
}

export default NewBookingPage