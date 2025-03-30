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
    return (
        <MainLayout navigation={<PageHeader page='Guests' subpage='Oyefeso Afolabi' />} customButton={<Button variant="destructive" onClick={() => { setOpen(true) }}>Check Out</Button>} buttonText={""} buttonVisible={true}>
            <div className="container mx-auto py-6 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Guest Information */}
                    <Card className="overflow-hidden col-span-2">
                        <CardContent className="p-0">
                            {/* Guest Header */}
                            <div className="p-6 flex items-center gap-4">
                                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-medium">
                                    OS
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">Oyefeso Afolabi</h2>
                                </div>
                                <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-md font-medium text-sm">
                                    CHECKED-IN
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Expires 12th Of January 2025
                                </div>
                            </div>

                            {/* Guest Details */}
                            <div className="bg-gray-50 p-6 rounded-lg mx-6 mb-6 grid grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Guest ID</p>
                                    <p className="font-medium">16bh9489g</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                                    <p className="font-medium">$375</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                                    <p className="font-medium">07057997839</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Booking Status</p>
                                    <p className="font-medium">Confirmed</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Room Name</p>
                                    <p className="font-medium">Sunrise Retreat</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Booking ID</p>
                                    <p className="font-medium">B001</p>
                                </div>
                            </div>

                            {/* Booking History */}
                            <div className="px-6 pb-6">
                                <h3 className="text-lg font-semibold mb-4">Booking History</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                                        <div>Booking ID</div>
                                        <div>Issue date & time</div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <a href="#" className="text-blue-600 hover:underline">16bh9489g</a>
                                            <div>22 Dec, 24 12:14</div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <a href="#" className="text-blue-600 hover:underline">16bh9489g</a>
                                            <div>22 Dec, 24 12:14</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column - Payment Information */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-end space-x-3 mb-12">
                                <Button className="rounded-full bg-black hover:bg-gray-800">
                                    Payment
                                </Button>
                                <Button variant="outline" className="rounded-full">
                                    Notes
                                </Button>
                            </div>

                            {/* Payment Details */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-600">3 Nights</div>
                                    <div className="font-semibold">₦200,000</div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-gray-600">Discount</div>
                                    <div className="text-green-600 font-semibold">-₦2,000</div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-gray-600">V.A.T</div>
                                    <div className="font-semibold">₦200</div>
                                </div>

                                <div className="border-t pt-6 flex justify-between items-center">
                                    <div className="text-gray-600">Subtotal</div>
                                    <div className="font-semibold">₦200,000</div>
                                </div>
                            </div>

                            {/* Invoice */}
                            <div className="mt-16 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-500 text-white p-2 rounded text-xs">
                                        PDF
                                    </div>
                                    <span className="font-medium">Invoice #816902K</span>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <FileDown className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardContent>
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