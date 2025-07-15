"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { GuestDetailsCard } from "@/components/reusable/GuestDetailsCard";
import { DynamicTable } from "@/components/reusable/GuestTable";
import axiosInstance from "@/api/axiosInstance";

interface TableData {
    id: string;
    amount: number;
    status: string;
    [key: string]: any;
}

const columns = [
    { key: "reference", header: "Transaction Ref" },
    { key: "amount", header: "Amount (₦)" },
    { key: "status", header: "Status" }
];

export default function ReconciliationPage() {
    const [bookingData, setBookingData] = useState<TableData[]>([]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [paginationInfo, setPaginationInfo] = useState({ page: 1, total: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPendingTransactions();
    }, []);

    const fetchPendingTransactions = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/payment/physical/pending-reconciliation", { headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` } });
            // console.log("Response:", res.data);
            const data = res.data?.data?.transactions || [];
            setBookingData(data);
            setPaginationInfo({ page: 1, total: data.length });
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReconcile = async () => {
        if (selectedRows.length === 0) return;

        try {
            await axiosInstance.post("/payment/physical/reconcile", {
                transaction_ids: selectedRows,
                reconciliation_notes: "Immediate reconciliation - amount verified",
            },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` } });
            fetchPendingTransactions();
            setSelectedRows([]);
        } catch (err) {
            console.error("Reconciliation error:", err);
        }
    };

    const handlePageChange = (page: number) => {
        setPaginationInfo((prev) => ({ ...prev, page }));
    };

    const handleRowAction = (action: string, row: TableData) => {
        if (action === "reconcile") {
            setSelectedRows((prev) => [...prev, row.id]);
        }
    };

    const getActionsForStatus = (status: string) => {
        return [
            {
                key: "reconcile",
                label: "Reconcile",
                action: "reconcile",
                disabled: status !== "pending",
            },
        ];
    };

    const renderCell = (key: string, item: TableData) => {
        if (key === "amount") {
            return `₦${(item.amount / 100).toLocaleString()}`;
        }
        return item[key];
    };

    return (
        <div className="p-6 space-y-6">
            <GuestDetailsCard>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Pending Reconciliation</h2>
                    <Button onClick={handleReconcile} disabled={selectedRows.length === 0}>
                        Reconcile Selected
                    </Button>
                </div>
                <DynamicTable
                    columns={columns}
                    data={bookingData}
                    // actions={(row: TableData) => getActionsForStatus(row.status)}
                    onPageChange={handlePageChange}
                    showCheckbox={true}
                    showActions={true}
                    onRowAction={handleRowAction}
                    //   renderCell={renderCell}
                    loading={loading}
                    itemsPerPage={10}
                //   onSelectRows={(rows: string[]) => setSelectedRows(rows)}
                />
            </GuestDetailsCard>
        </div>
    );
}
