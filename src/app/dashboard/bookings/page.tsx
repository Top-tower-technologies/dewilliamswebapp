"use client"
import MainLayout from '@/components/layout/MainLayout'
import React from 'react'
import { useRouter } from 'next/navigation'
import { DynamicTable } from '@/components/reusable/GuestTable'
import { GuestDetailsCard } from '@/components/reusable/GuestDetailsCard'

const page = () => {
  const router = useRouter()

  const columns = [
    { key: 'id', header: 'Booking ID', cellClassName: 'font-medium' },
    { key: 'name', header: 'Full Name', },
    { key: 'number', header: 'Phone Number' },
    { key: 'roomNo', header: 'Room No' },
    { key: 'dateandtime', header: 'Issue date and time' },
    { key: 'price', header: 'Total Amount' },
    {
      key: 'status',
      header: 'Reservation',
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

  const actions = [
    { key: 'book', label: 'Book Room' },
    { key: 'maintenance', label: 'Schedule Maintenance' },
    { key: 'details', label: 'View Details' }
  ];

  // Sample data - replace with your actual data

  return (
    <MainLayout navigation={<p className='text-[20px] font-[400]'>Booking</p>} buttonText={"New Booking"} handleClick={() => router.push("/dashboard/bookings/new-booking")}>
      <div className='p-4'>
        <GuestDetailsCard>

          <DynamicTable
            columns={columns} // TODO: Replace with your columns definition
            data={[]}    // TODO: Replace with your data array
            actions={actions} // TODO: Replace with your actions definition
            itemsPerPage={10}
            showCheckbox={true}
            showActions={true}
            onRowAction={(actionKey, item, index) => {
              console.log(`Action: ${actionKey}`, item);
              // Add your action handling logic here
              switch (actionKey) {
                case 'book':
                  console.log(`Booking room for ${item.name}`);
                  break;
                case 'maintenance':
                  console.log(`Scheduling maintenance for ${item.roomNumber}`);
                  break;
                case 'details':
                  console.log(`Viewing details for ${item.name}`);
                  break;
                default:
                  console.log(`Unknown action: ${actionKey}`);
                  break;
              }
            }
            }
            renderCell={(item, column) => {
              if (column.key === 'status') {
                return (
                  <span className={`badge ${item.status === 'Available' ? 'badge-success' : item.status === 'Occupied' ? 'badge-danger' : 'badge-secondary'}`}>
                    {item.status}
                  </span>
                );
              }
              return item[column.key];
            }
            }
          />
        </GuestDetailsCard>
      </div>
    </MainLayout>
  )
}

export default page