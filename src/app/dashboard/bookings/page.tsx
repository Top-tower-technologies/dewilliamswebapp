"use client"
import MainLayout from '@/components/layout/MainLayout'
import GuestTable from '@/components/reusable/GuestTable'
import React from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()
  return (
    <MainLayout navigation={<p className='text-[20px] font-[400]'>Booking</p>} buttonText={"New Booking"} handleClick={() => router.push("/dashboard/bookings/new-booking")}>
      <GuestTable />
    </MainLayout>
  )
}

export default page