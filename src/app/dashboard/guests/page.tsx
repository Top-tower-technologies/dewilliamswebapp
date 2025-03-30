// app/page.jsx
'use client'

import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { OccupancyTrendCard } from "@/components/reusable/OccupancyTrendCard";
import { StatCard } from "@/components/reusable/StatCard";


export default function Dashboard() {
  const guestData = [
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Pending' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
    { id: '#16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Pending' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
    { id: '16bh9489g', name: 'Oyefeso Afolabi', phone: '07057997839', room: '#401', status: 'Checked in' },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Guests" 
          value="256" 
          change={15.2} 
          previousValue="from 6,532 (last week)" 
        />
        <StatCard 
          title="Currently Checked-In" 
          value="32" 
          change={15.2} 
          previousValue="from 6,532 (last week)" 
        />
        <StatCard 
          title="Checked-Out Today" 
          value="115" 
          change={15.2} 
          previousValue="from 6,532 (last week)" 
        />
        <StatCard 
          title="Checked-Out Today" 
          value="6,672" 
          change={15.2} 
          previousValue="from 6,532 (last week)" 
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GuestDetailsCard guestData={guestData} />
        </div>
        <div className="lg:col-span-1">
          <OccupancyTrendCard />
        </div>
      </div>
    </div>
  );
}