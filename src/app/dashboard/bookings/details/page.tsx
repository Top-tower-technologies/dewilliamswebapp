'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import MainLayout from "@/components/layout/MainLayout";
import { ChevronLeftCircle, ChevronRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BookingDetails() {
    const [open, setOpen] = useState(false)
    return (
        <MainLayout navigation={<div className='flex justify-center gap-x-3 items-center'> <Link href={"/dashboard/bookings"}> <ChevronLeftCircle className='text-[#8F8F8F52] hover:text-[#000]' size={30} /> </Link> <p className='text-[20px] font-[400] text-[#8F8F8F]'>Booking</p> <ChevronRight /> <p className='text-[20px] font-[400]'>Booking Details</p></div>} buttonText={""} buttonVisible={true} >
            <div className="p-6 grid grid-cols-3 gap-6">
                <Card className="col-span-2 pt-0">
                    <div className="w-full flex items-center justify-between bg-[#F9F9F9] p-3 py-5 rounded-t-xl">
                        <h2 className="text-xl font-semibold">Booking Details</h2>

                        <div className="flex justify-end">
                            <Button variant="destructive" onClick={() => { setOpen(true) }}>Cancel Booking</Button>
                        </div>
                    </div>
                    <CardContent className="grid grid-cols-1 gap-6">
                        {/* Guest Info */}
                        <div className=" p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-semibold">
                                        OS
                                    </div>
                                    <span className="text-lg font-medium">Oyefeso Afolabi</span>
                                </div>
                                <div className="">
                                    <span className="bg-pink-100 text-pink-500 px-3 py-1 rounded text-sm">
                                        Reserved for 22 Dec, 2024
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-4 text-sm text-gray-700 bg-[#F9F9F9] p-4 rounded-md border border-[#E4E7EC]">
                                <div>
                                    <p className="font-medium">Guest ID</p>
                                    <p>16bh9489g</p>
                                </div>
                                <div>
                                    <p className="font-medium">Total Amount</p>
                                    <p>$375</p>
                                </div>
                                <div>
                                    <p className="font-medium">Phone Number</p>
                                    <p>07057997839</p>
                                </div>
                                <div>
                                    <p className="font-medium">Booking Status</p>
                                    <p className="text-green-500">Confirmed</p>
                                </div>
                                <div>
                                    <p className="font-medium">Room Name</p>
                                    <p>Sunrise Retreat</p>
                                </div>
                                <div>
                                    <p className="font-medium">Booking ID</p>
                                    <p>BO001</p>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-4 text-sm text-gray-700 bg-[#F9F9F9] p-4 rounded-md border border-[#E4E7EC]">
                                <div>
                                    <p className="font-medium">Guest ID</p>
                                    <p>16bh9489g</p>
                                </div>
                                <div>
                                    <p className="font-medium">Total Amount</p>
                                    <p>$375</p>
                                </div>
                                <div>
                                    <p className="font-medium">Phone Number</p>
                                    <p>07057997839</p>
                                </div>
                                <div>
                                    <p className="font-medium">Booking Status</p>
                                    <p className="text-green-500">Confirmed</p>
                                </div>
                            </div>

                        </div>


                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {/* Booking Summary */}
                        <div className=" p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Booking Summary</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>3 Nights</span>
                                    <span>&#8358;200,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>V.A.T</span>
                                    <span>&#8358;200</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between font-semibold">
                                    <span>Subtotal</span>
                                    <span>&#8358;200,000</span>
                                </div>
                            </div>
                            <Button className="w-full mt-4">Send Booking Reminder</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={open} onOpenChange={() => setOpen(false)}>
                <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
                    <div className="p-8 bg-[#FFF1F2] rounded-full grid place-items-start">

                        <TriangleAlert size={100} className="text-[#ED1522]" />
                    </div>
                    {/* <DialogHeader> */}
                    <DialogTitle className="text-2xl">Cancel Booking?</DialogTitle>
                    <DialogDescription className="text-center text-md">
                        Once a booking is cancelled, the process cannot be reversed.
                    </DialogDescription>
                    {/* </DialogHeader> */}

                    <div className="grid space-y-2">
                        <Button variant="destructive" onClick={() => { }}>Yes, Cancel Booking</Button>
                        <Button variant="ghost" onClick={() => { setOpen(false) }}>No, Go back</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </MainLayout>

    );
}
