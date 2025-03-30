"use client"
import MainLayout from '@/components/layout/MainLayout'
import PageHeader from '@/components/reusable/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeftCircle, ChevronRight, FileDown, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState } from 'react'

const page = () => {
    const [open, setOpen] = useState(false)
    const booking = {
        suite: "Deluxe Suite",
        location: "Ibadan, NG",
        pricePerNight: 375,
        guest: {
            initials: "OS",
            name: "Oyefeso Afolabi",
            status: "CHECKED-IN"
        },
        details: {
            guestId: "16bh9489g",
            totalAmount: 375,
            phoneNumber: "07057997839",
            bookingStatus: "Confirmed",
            roomName: "Sunrise Retreat",
            bookingId: "BO01"
        },
        history: [
            { id: "16bh9489g", issueDate: "22 Dec, 24 12:14" },
            { id: "16bh9489g", issueDate: "22 Dec, 24 12:14" },
            { id: "16bh9489g", issueDate: "22 Dec, 24 12:14" }
        ]
    };

    return (
        <MainLayout navigation={<PageHeader page='Rooms' subpage='Room 401' />} customButton={<Button variant="destructive" onClick={() => { setOpen(true) }}>Check Out</Button>} buttonText={""} buttonVisible={true}>
            <div className="container mx-auto py-6 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Guest Information */}
                    <Card className="rounded-2xl border p-6 shadow-sm col-span-2">
                        {/* Header with suite info */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold">{booking.suite}</h2>
                                <p className="text-gray-500">{booking.location}</p>
                            </div>
                            <div className="text-right">
                                <p>
                                    <span className="text-blue-500 font-bold text-xl">${booking.pricePerNight}</span>
                                    <span className="text-gray-700"> / per Night</span>
                                </p>
                            </div>
                        </div>

                        {/* Guest info card */}
                        <Card className="rounded-2xl border p-6 mb-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-medium">
                                    {booking.guest.initials}
                                </div>
                                <div>
                                    <p className="text-lg font-medium">{booking.guest.name}</p>
                                </div>
                                <div className="bg-pink-100 text-pink-600 px-4 py-1 rounded-lg text-sm font-medium">
                                    {booking.guest.status}
                                </div>
                            </div>

                            {/* Booking details */}
                            <Card className="rounded-lg border p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Guest ID</p>
                                        <p className="font-medium">{booking.details.guestId}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                                        <p className="font-medium">${booking.details.totalAmount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                                        <p className="font-medium">{booking.details.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                                        <p className="font-medium">{booking.details.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Booking Status</p>
                                        <p className="font-medium">{booking.details.bookingStatus}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Room Name</p>
                                        <p className="font-medium">{booking.details.roomName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Booking ID</p>
                                        <p className="font-medium">{booking.details.bookingId}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Booking ID</p>
                                        <p className="font-medium">{booking.details.bookingId}</p>
                                    </div>
                                </div>
                            </Card>
                        </Card>

                        {/* Booking history section */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">Booking History</h3>
                            <Card className="rounded-lg border">
                                <div className="p-4 border-b">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="font-medium">Booking ID</div>
                                        <div className="font-medium text-right">Issue date & time</div>
                                    </div>
                                </div>

                                {booking.history.map((item, index) => (
                                    <div key={index} className="p-4 border-b last:border-0">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>{item.id}</div>
                                            <div className="text-right">{item.issueDate}</div>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    </Card>


                </div>
            </div>
            <Dialog open={open} onOpenChange={() => setOpen(false)}>
                <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
                    <div className="p-8 bg-[#FFF1F2] rounded-full grid place-items-start">

                        <TriangleAlert size={80} className="text-[#ED1522]" />
                    </div>
                    {/* <DialogHeader> */}
                    <DialogTitle className="text-2xl">You’re about to checkout a guest!</DialogTitle>
                    <DialogDescription className="text-center text-md">
                        Once a guest is checked out, the process cannot be reversed.
                    </DialogDescription>
                    {/* </DialogHeader> */}

                    <div className="grid space-y-2">
                        <Button variant="destructive" onClick={() => { }}>Yes, Check Out</Button>
                        <Button variant="ghost" onClick={() => { setOpen(false) }}>No, Go back</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </MainLayout>
    )
}

export default page