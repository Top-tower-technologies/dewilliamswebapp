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
    {key: 'name', header: 'Full Name',},
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
  const sampleData = [
    { 
      id: '16bh9489g', 
      name: 'Oyefeso Afolabi', 
      number: '07057997839', 
      roomNo: '#401', 
      dateandtime: '2023-10-01 12:00', 
      price: '$100', 
      status: 'Available' 
    },
    { 
      id: '16bh9489g', 
      name: 'John Doe', 
      number: '08012345678', 
      roomNo: '#402', 
      dateandtime: '2023-10-02 14:30', 
      price: '$150', 
      status: 'Occupied' 
    },
    { 
      id: '16bh9489g', 
      name: 'Jane Smith', 
      number: '09098765432', 
      roomNo: '#403', 
      dateandtime: '2023-10-03 09:15', 
      price: '$200', 
      status: 'Maintenance' 
    },
    { 
      id: '16bh9489g', 
      name: 'Alice Johnson', 
      number: '07011223344', 
      roomNo: '#404', 
      dateandtime: '2023-10-04 11:45', 
      price: '$120', 
      status: 'Available' 
    }
  ];

  return (
    <MainLayout navigation={<p className='text-[20px] font-[400]'>Booking</p>} buttonText={"New Booking"} handleClick={() => router.push("/dashboard/bookings/new-booking")}>
      <div className='p-4'>
        <GuestDetailsCard>

      <DynamicTable
        columns={columns} // TODO: Replace with your columns definition
        data={sampleData}    // TODO: Replace with your data array
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