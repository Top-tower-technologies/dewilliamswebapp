"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import axiosInstance from '@/api/axiosInstance';
import { useEffect, useState } from 'react';


type PosFormProps = {
    totalAmount: number | undefined;
    transactionRef: string | undefined;
    serviceId: number | undefined;
    posDialogOpen: boolean;
    setPosDialogOpen: (open: boolean) => void;
};



const MessageDisplay = ({
    message,
    type,
    isVisible,
}: {
    message: string;
    type: "success" | "error";
    isVisible: boolean;
}) => {
    if (!isVisible || !message) return null;

    return (
        <div
            className={`text-sm font-medium mb-4 transition-all duration-300 w-full p-3 rounded-md ${type === "success"
                ? "text-green-600 border border-green-200 bg-green-50"
                : "text-red-500 border border-red-200 bg-red-50"
                }`}
        >
            {message}
        </div>
    );
};

export const PosForm = ({ totalAmount, transactionRef, serviceId, posDialogOpen, setPosDialogOpen }: PosFormProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        payment_method: '',
        receipt_number: '',
        pos_terminal_id: '',
        email: '',
        description: '',
        notes: '',
    });
    const [message, setMessage] = useState({
        message: "", // ✅ renamed
        type: "error" as "success" | "error",
        isVisible: false,
    });
    useEffect(() => {
        if (message.isVisible) {
            const timer = setTimeout(() => {
                setMessage(prev => ({ ...prev, isVisible: false }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                `/payment/physical/process`,
                {
                    amount: totalAmount,
                    payment_method: formData.payment_method,
                    receipt_number: formData.receipt_number,
                    pos_terminal_id: formData.pos_terminal_id,
                    reference: transactionRef,
                    email: formData.email,
                    description: formData.description,
                    service_id: serviceId,
                    notes: formData.notes,
                },
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
                }
            );
            setMessage({ message: "Payment processed successfully.", type: "success", isVisible: true });
            setFormData({ payment_method: '', receipt_number: '', pos_terminal_id: '', email: '', description: '', notes: '' });
            setPosDialogOpen(false);
        } catch (error: any) {
            setMessage({
                message: error.response?.data?.message || "An error occurred while processing the payment.",
                type: "error",
                isVisible: true,
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={posDialogOpen} onOpenChange={setPosDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Physical Payment Processing</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <MessageDisplay
                        message={message.message} // ✅ explicitly map the keys
                        type={message.type}
                        isVisible={message.isVisible}
                    />
                    <Input name="amount" type='number' readOnly value={totalAmount} />
                    <Input name="receipt_number" placeholder="Receipt Number" onChange={handleChange} value={formData.receipt_number} />
                    <Input name="pos_terminal_id" placeholder="POS Terminal ID" onChange={handleChange} value={formData.pos_terminal_id} />
                    <Input name="reference" placeholder="Reference" readOnly value={transactionRef} />
                    <Input name="email" placeholder="Customer Email" onChange={handleChange} value={formData.email} />
                    <Input name="description" placeholder="Description" onChange={handleChange} value={formData.description} />
                    <Input name="service_id" placeholder="Service ID" readOnly value={serviceId} />
                    <Textarea name="notes" placeholder="Notes (optional)" onChange={handleChange} value={formData.notes} />
                </div>

                <Button onClick={handleFormSubmit} className="mt-4 w-full" disabled={loading}>
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </div>
                    ) : (
                        "Submit Payment"
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
};