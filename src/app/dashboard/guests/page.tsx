// app/page.jsx
'use client'

import MainLayout from "@/components/layout/MainLayout";
import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { DynamicTable } from "@/components/reusable/GuestTable";
import { OccupancyTrendCard } from "@/components/reusable/OccupancyTrendCard";
import PageHeader from "@/components/reusable/PageHeader";
import { StatCard } from "@/components/reusable/StatCard";


export default function Dashboard() {
  const colums = [
    { key: 'id', header: 'ID', type: 'text', className: 'w-1/3' },
    { key: 'name', header: 'Name', type: 'text', className: 'w-1/3' },
    { key: 'phone', header: 'Phone', type: 'text', className: 'w-1/3' },
    { key: 'room', header: 'Room', type: 'text', className: 'w-1/4' },
    { key: 'status', header: 'Status', type: 'badge', className: 'w-1/4' },
  ];
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
    <MainLayout buttonText={""} buttonVisible={true} navigation={<PageHeader page='Guests' icon={false} />}>
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

        <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GuestDetailsCard>

              <DynamicTable
                columns={colums}
                data={guestData}
                actions={[
                  { key: 'book', label: 'Book Room' },
                  { key: 'maintenance', label: 'Schedule Maintenance' },
                  { key: 'details', label: 'View Details' }
                ]}
                showCheckbox={true}
                itemsPerPage={10}
                showActions={true}
                onRowAction={(actionKey, item, index) => {
                  console.log(`Action: ${actionKey}`, item);
                  // Add your action handling logic here
                  switch (actionKey) {
                    case 'book':
                      console.log(`Booking room for ${item.name}`);
                      break;
                    case 'maintenance':
                      console.log(`Scheduling maintenance for ${item.room}`);
                      break;
                    case 'details':
                      console.log(`Viewing details for ${item.name}`);
                      break;
                    default:
                      console.log(`Unknown action: ${actionKey}`);
                      break;
                  }
                }}
                renderCell={(item, column) => {
                  if (column.key === 'status') {
                    return (
                      <span className={`badge ${item.status === 'Checked in' ? 'badge-success' : 'badge-warning'}`}>
                        {item.status}
                      </span>
                    );
                  }
                  return item[column.key];
                }}
              />
            </GuestDetailsCard>
          </div>
          <div className="lg:col-span-1">
            <OccupancyTrendCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}