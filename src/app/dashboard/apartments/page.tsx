// app/page.jsx
'use client'

import MainLayout from "@/components/layout/MainLayout";
import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { DynamicTable } from "@/components/reusable/GuestTable";
import { OccupancyTrendCard } from "@/components/reusable/OccupancyTrendCard";
import PageHeader from "@/components/reusable/PageHeader";
import { StatCard } from "@/components/reusable/StatCard";


export default function Dashboard() {
  const columns = [
    { key: 'roomNumber', header: 'Apartment Number', cellClassName: 'font-medium' },
    { key: 'name', header: 'Apartment Name', },
    { key: 'type', header: 'Apartment Type' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'price', header: 'Price per Night' },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      badgeVariant: (status: string) => {
        switch (status) {
          case 'Available': return 'default';
          case 'Occupied': return 'destructive';
          case 'Maintenance': return 'secondary';
          default: return 'outline';
        }
      }
    }
  ];

  const handleRowAction = (
    actionKey: string,
    item: {
      roomNumber: string;
      type: string;
      capacity: number;
      price: string;
      status: string;
    },
    index: number
  ) => {
    console.log(`Action: ${actionKey}`, item);
    // Add your action handling logic here
    switch (actionKey) {
      case 'book':
        console.log(`Booking room ${item.roomNumber}`);
        break;
      case 'maintenance':
        console.log(`Scheduling maintenance for room ${item.roomNumber}`);
        break;
      case 'details':
        console.log(`Viewing details for room ${item.roomNumber}`);
        break;
    }
  };

  const actions = [
    { key: 'book', label: 'Book Room' },
    { key: 'maintenance', label: 'Schedule Maintenance' },
    { key: 'details', label: 'View Details' }
  ];

  return (
    <MainLayout buttonText={""} buttonVisible={true} navigation={<PageHeader page='Apartments' icon={false} />}>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Apartments"
            value="0"
            change={0}
            previousValue=""
          />
          <StatCard
            title="Currently Available"
            value="0"
            change={0}
            previousValue=""
          />
          <StatCard
            title="Currently Occupied"
            value="0"
            change={0}
            previousValue=""
          />
          <StatCard
            title="Checked-Out Today"
            value="0"
            negative={true}
            change={0}
            previousValue=""
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <GuestDetailsCard>
            <DynamicTable
              columns={columns}
              data={[]}
              actions={actions}
              onRowAction={handleRowAction}
              itemsPerPage={10}
              showCheckbox={true}
              showActions={true}
            />
          </GuestDetailsCard>
        </div>
      </div>
    </MainLayout>
  );
}