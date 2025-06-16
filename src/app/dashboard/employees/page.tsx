"use client"
import MainLayout from '@/components/layout/MainLayout'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DynamicTable } from '@/components/reusable/GuestTable'
import { GuestDetailsCard } from '@/components/reusable/GuestDetailsCard'

interface TableData {
  adminId: string;
  fullName: string;
  email: string;
  status: string;
}

const page = () => {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    totalPages: 30,
  });

  useEffect(() => {
    fetchReservations(paginationInfo.page, 10)
  }, [])

  const fetchReservations = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      // Simulated fetch - replace with real API call
      const response = await new Promise<{ data: TableData[] }>((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                adminId: "ADM-001-EA",
                fullName: "Oyefeso Afolabi",
                email: "oyefesoafolabiteniola@gmail.com",
                status: "Pending Verification",
              },
              {
                adminId: "ADM-001-EA",
                fullName: "Oyefeso Afolabi",
                email: "oyefesoafolabiteniola@gmail.com",
                status: "Verified",
              },
              {
                adminId: "ADM-001-EA",
                fullName: "Oyefeso Afolabi",
                email: "oyefesoafolabiteniola@gmail.com",
                status: "Pending Verification",
              },
            ]
          });
        }, 1000);
      });
      setBookingData(response.data);
    } catch (err: any) {
      setError('Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: "adminId", header: "Admin ID" },
    { key: "fullName", header: "Full Name" },
    { key: "email", header: "Email Address" },
    { key: "status", header: "Status" },
  ];

  const renderCell = (item: TableData, column: { key: string; header: string }) => {
    if (column.key === "status") {
      return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          item.status === "Verified" ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-700"
        }`}>
          {item.status}
        </span>
      );
    }
    return item[column.key as keyof TableData];
  };

  const handlePageChange = (page: number) => {
    setPaginationInfo((prev) => ({ ...prev, page }));
    fetchReservations(page, 10);
  };

  const handleRowAction = (action: string, row: TableData) => {
    console.log("Action:", action, "on", row);
  };

  const getActionsForStatus = (status: string) => {
    return [
      {
        key: "view",
        label: "View Details",
      },
      {
        key: status === "Verified" ? "revoke" : "verify",
        label: status === "Verified" ? "Revoke Access" : "Verify Admin",
      },
    ];
  };

  if (loading && bookingData.length === 0) {
    return (
      <MainLayout navigation={<p className='text-[20px] font-[400]'>Admins</p>} buttonText={"New Admin"} handleClick={() => router.push("/dashboard/admins/new")}>        
        <div className='p-4'>
          <GuestDetailsCard>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <span className="ml-4">Loading admins...</span>
            </div>
          </GuestDetailsCard>
        </div>
      </MainLayout>
    );
  }

  if (error && bookingData.length === 0) {
    return (
      <MainLayout navigation={<p className='text-[20px] font-[400]'>Admins</p>} buttonText={"New Admin"} handleClick={() => router.push("/dashboard/admins/new")}>        
        <div className='p-4'>
          <GuestDetailsCard>
            <div className="flex flex-col justify-center items-center h-64">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={() => fetchReservations(1, 10)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </GuestDetailsCard>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={<p className='text-[20px] font-[400]'>Admins</p>} buttonText={"New Admin"} handleClick={() => router.push("/dashboard/admins/new")}>      
      <div className='p-4'>
        <GuestDetailsCard>
          <DynamicTable
            columns={columns}
            data={bookingData}
            actions={(row: TableData) => getActionsForStatus(row.status)}
            paginationMode="server"
            paginationInfo={paginationInfo}
            onPageChange={handlePageChange}
            showCheckbox={true}
            showActions={true}
            onRowAction={handleRowAction}
            renderCell={renderCell}
            loading={loading}
          />
        </GuestDetailsCard>
      </div>
    </MainLayout>
  )
}

export default page;