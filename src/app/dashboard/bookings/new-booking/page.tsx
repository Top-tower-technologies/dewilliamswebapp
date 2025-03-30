"use client"
import MainLayout from '@/components/layout/MainLayout'
import { ArrowRight, ChevronLeftCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from 'react'

const page = () => {
    return (
        <MainLayout
            navigation={<div className='flex justify-center gap-x-3 items-center'> <Link href={"/dashboard/bookings"}> <ChevronLeftCircle className='text-[#8F8F8F52] hover:text-[#000]' size={30} /> </Link> <p className='text-[20px] font-[400] text-[#8F8F8F]'>Booking</p> <ChevronRight /> <p className='text-[20px] font-[400]'>New Booking</p></div>}
            buttonText={""} buttonVisible={true} >
            <div className="p-6 grid grid-cols-3 gap-6">
                {/* Booking Details */}
                <Card className="col-span-2">
                    <CardHeader className='flex justify-between'>
                        <CardTitle>Booking Details</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline">Reset</Button>
                            <Button variant="destructive">Cancel Booking</Button>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-4 space-y-4">
                        {/* Check-in Details */}
                        <div className='shadow rounded'>
                            <div className='px-3 py-2 w-full bg-[#F9F9F9]'>
                                <p>Check-in Details</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 p-3.5">
                                <label className="block">
                                    <span className="text-sm text-gray-600">Check In</span>
                                    <Input placeholder="DD - MM - YYYY" />
                                </label>
                                <label className="block">
                                    <span className="text-sm text-gray-600">Check Out</span>
                                    <Input value="16 - 10 - 24" readOnly />
                                </label>
                                <label className="block">
                                    <span className="text-sm text-gray-600">Occupancy</span>
                                    <Input value="2 Persons" readOnly />
                                </label>
                            </div>
                        </div>
                        <div className='shadow rounded'>
                            <div className='px-3 py-2 w-full bg-[#F9F9F9]'>
                                <p>Room Details</p>
                            </div>
                            {/* Room Details */}
                            <div className="grid grid-cols-3 gap-4 p-3">
                                <label className="block">
                                    <span className="text-sm text-gray-600">Room Type</span>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Suite" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="suite">Suite</SelectItem>
                                            <SelectItem value="deluxe">Deluxe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </label>

                                <label className="block">
                                    <span className="text-sm text-gray-600">Room Name</span>
                                    <Input value="Deluxe Suite" readOnly />
                                </label>
                                <label className="block">
                                    <span className="text-sm text-gray-600">Room Number</span>
                                    <Input value="#401" readOnly />
                                </label>
                            </div>
                        </div>
                        <div className='shadow rounded'>
                            <div className='px-3 py-2 w-full bg-[#F9F9F9]'>
                                <p>Guest Details</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 p-3.5">
                                <label className="block">
                                    <span className="text-sm text-gray-600">Full Name</span>
                                    <Input value="Oyefeso Afolabi" readOnly />
                                </label>
                                <label className="block">
                                    <span className="text-sm text-gray-600">Email Address</span>
                                    <Input value="Oyefeso@paywithtetra.com" readOnly />
                                </label>
                                <label className="block">
                                    <span className="text-sm text-gray-600">Phone Number</span>
                                    <Input value="07057997839" readOnly />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4 p-3.5">
                                <label className="block">
                                    <span className="text-sm text-gray-600">Address</span>
                                    <Input placeholder="Optional" />
                                </label>
                                <div className="flex items-center relative">
                                    <label className="block w-full">
                                        <span className="text-sm text-gray-600">Discount Code</span>
                                        <Input value="82hKNHI92" readOnly className='' />
                                    </label>
                                    <span className="text-[#007E0A] text-xs p-1 rounded right-2 top-1/2 block absolute bg-[#ECFFED]">Saved 20%</span>
                                </div>
                            </div>
                            <div className='p-3.5'>
                                <label className="block">
                                    <span className="text-sm text-gray-600">Special Request</span>
                                    <Input placeholder="Special Request" />
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Booking Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex justify-between">
                            <span>3 Nights</span>
                            <span>₦200,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span>VAT</span>
                            <span>₦200</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold">
                            <span>Subtotal</span>
                            <span>₦200,000</span>
                        </div>
                        <Button className="w-full">Pay for the Room</Button>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}

export default page