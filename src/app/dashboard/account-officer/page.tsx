"use client";

import { useEffect, useState, useCallback } from "react";
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
    // { key: "service_id", header: "Service ID" },
    { key: "email", header: "Email" },
    { key: "reference", header: "Transaction Ref" },
    { key: "payment_method", header: "Payment Method" },
    { key: "receipt_number", header: "Receipt Number" },
    { key: "pos_terminal_id", header: "Terminal ID" },
    { key: "amount", header: "Amount (₦)" },
    { key: "status", header: "Status" },
];

export default function ReconciliationPage() {
    const [bookingData, setBookingData] = useState<TableData[]>([]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [paginationInfo, setPaginationInfo] = useState({ page: 1, total: 0 });
    const [loading, setLoading] = useState(false);

    const fetchPendingTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/payment/physical/pending-reconciliation", {
                headers: { Authorization: `Bearer ${localStorage.getItem("AuthKey")}` },
            });

            const data = res.data?.data?.transactions || [];
            console.log("Fetched pending transactions:", data);
            setBookingData(data);
            setPaginationInfo({ page: 1, total: data.length });
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingTransactions();
    }, [fetchPendingTransactions]);

    // 🧠 Reconcile Selected Rows (Bulk)
    const handleBulkReconcile = async () => {
        if (selectedRows.length === 0) return;

        try {
            await axiosInstance.post(
                "/payment/physical/reconcile",
                {
                    transaction_ids: selectedRows,
                    reconciliation_notes: "Immediate reconciliation - amount verified",
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("AuthKey")}` },
                }
            );

            await fetchPendingTransactions();
            setSelectedRows([]);
        } catch (err) {
            console.error("Bulk reconciliation error:", err);
        }
    };

    // 🧠 Handle checkbox selections
    const handleRowSelection = (rowIds: string[]) => {
        setSelectedRows(rowIds);
    };

    // 🧠 Optional: Per-row Reconciliation
    const handleRowAction = async (action: string, row: TableData) => {
        if (action === "reconcile") {
            try {
                await axiosInstance.post(
                    "/payment/physical/reconcile",
                    {
                        transaction_ids: [row.id],
                        reconciliation_notes: "Single reconciliation - verified",
                    },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("AuthKey")}` },
                    }
                );

                await fetchPendingTransactions();
            } catch (err) {
                console.error("Single row reconciliation error:", err);
            }
        }
    };

    const getActionsForStatus = (status: string) => [
        {
            key: "reconcile",
            label: "Reconcile",
            action: "reconcile",
            disabled: status !== "pending",
        },
    ];

    const renderCell = (item: TableData, column: { key: string }) => {
        const { key } = column;

        if (key === "amount") {
            return `₦${(item.amount).toLocaleString()}`;
        }

        return item[key];
    };

    return (
        <div className="p-6 space-y-6">
            <GuestDetailsCard>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Pending Reconciliation</h2>
                    {/* <Button
                        onClick={handleBulkReconcile}
                        disabled={selectedRows.length === 0}
                    >
                        Reconcile Selected
                    </Button> */}
                </div>
                <DynamicTable
                    columns={columns}
                    data={bookingData}
                    actions={(row: TableData) => getActionsForStatus(row.status)}
                    // onPageChange={handlePageChange}
                    showCheckbox={true}
                    showActions={true}
                    onRowAction={handleRowAction}
                    onSelectRows={handleRowSelection}
                    renderCell={renderCell}
                    loading={loading}
                    itemsPerPage={10}
                />
            </GuestDetailsCard>
        </div>
    );
}
