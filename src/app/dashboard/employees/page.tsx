"use client";
import MainLayout from '@/components/layout/MainLayout';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DynamicTable } from '@/components/reusable/GuestTable';
import { GuestDetailsCard } from '@/components/reusable/GuestDetailsCard';
import axiosInstance from '@/api/axiosInstance';

interface TableData {
  adminId: string;
  fullName: string;
  email: string;
  status: string;
}

const Page = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/staff/employees`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('AuthKey')}`,
        },
      });

      console.log("Response:", response.data.data.data);

      // Adjust this if your API response shape differs
      setBookingData(response.data.data.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError('Failed to fetch admins.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "role", header: "Role" },
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name" },
    { key: "email", header: "Email Address" },
    { key: "phone", header: "Phone Number" },
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

  const handleRowAction = (action: string, row: TableData) => {
    console.log("Action:", action, "on", row);
  };

  const getActionsForStatus = (status: string) => [
    { key: "view", label: "View Details" },
    {
      key: status === "Verified" ? "revoke" : "verify",
      label: status === "Verified" ? "Revoke Access" : "Verify Admin",
    },
  ];

  if (loading && bookingData.length === 0) {
    return (
      <MainLayout
        navigation={<p className='text-[20px] font-[400]'>Admins</p>}
        buttonText={"New Admin"}
        handleClick={() => router.push("/dashboard/admins/new")}
      >        
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
      <MainLayout
        navigation={<p className='text-[20px] font-[400]'>Admins</p>}
        buttonText={"New Admin"}
        handleClick={() => router.push("/dashboard/admins/new")}
      >        
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
                onClick={() => fetchReservations()}
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
    <MainLayout
      navigation={<p className='text-[20px] font-[400]'>Employees</p>}
      buttonText={"New Employee"}
      // handleClick={() => router.push("/dashboard/admins/new")}
    >      
      <div className='p-4'>
        <GuestDetailsCard>
          <DynamicTable
            columns={columns}
            data={bookingData}
            actions={(row: TableData) => getActionsForStatus(row.status)}
            showCheckbox={true}
            showActions={true}
            onRowAction={handleRowAction}
            renderCell={renderCell}
            loading={loading}
          />
        </GuestDetailsCard>
      </div>
    </MainLayout>
  );
};

export default Page;