"use client"
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { BookCheck, Loader2, AlertCircle } from "lucide-react";
import { apiService } from "@/api/apiService";

export default function ReservationCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  type ReservationData = {
    name?: string;
    assigned_service_no?: string;
    days?: number;
    guest_count?: number;
  };

  const [reservationData, setReservationData] = useState<ReservationData | null>(null);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    // Clear error when user starts typing
    if (error) setError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const confirmReservation = async () => {
    const reservationCode = code.join("");

    // Validate code length
    if (reservationCode.length !== 6) {
      setError("Please enter a complete 6-digit reservation code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiService.verifyReservation(reservationCode);

      // Check if the response is successful
      if (response.data.success && response.data.data) {
        // Store reservation data and open success dialog
        setReservationData(response.data.data);
        setOpen(true);
      } else {
        throw new Error(response.data.message || 'Failed to verify reservation code');
      }

    } catch (error: any) {
      console.error('Reservation verification error:', error);
      setError(error.message || 'Failed to verify reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCode(["", "", "", "", "", ""]);
    setError("");
    setReservationData(null);
    setOpen(false);
    // Focus first input
    const firstInput = document.getElementById('input-0');
    if (firstInput) {
      firstInput.focus();
    }
  };

  return (
    <MainLayout buttonText={"text"} buttonVisible={true}>
      <div className="w-full h-[70vh] grid place-items-center">
        <div className="flex flex-col items-center p-10 border rounded-xl shadow-md bg-white max-w-2/3 mx-auto">
          <div className="w-full flex items-center justify-between py-4 mb-4">
            <p className="text-lg font-medium">Enter Reservation Code</p>

            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={confirmReservation}
              disabled={loading || code.join("").length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm Reservation"
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            {code.map((char, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 ${error ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-500 text-sm mb-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <p className="text-gray-500 text-xs mt-3">
            You need the 6 digit code sent to the customer's Mail to initiate check-in.
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
          <div className="p-8 bg-[#FFD4001A] rounded-full grid place-items-start">
            <BookCheck size={70} className="text-[#FFD400]" />
          </div>

          <DialogTitle className="text-2xl">Booking Confirmed</DialogTitle>

          <div className="space-y-2 text-black">
            <DialogDescription className="text-center text-md text-black">
              <strong>Client's Name:</strong> {reservationData?.name || "N/A"}
            </DialogDescription>
            <DialogDescription className="text-center text-md text-black">
              <strong>Assigned Service No:</strong> {reservationData?.assigned_service_no || "N/A"}
            </DialogDescription>
            <DialogDescription className="text-center text-md text-black">
              <strong>Stay:</strong> {reservationData?.days || "N/A"} days, {reservationData?.guest_count || "N/A"} Guests
            </DialogDescription>
          </div>

          <div className="grid space-y-2">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={resetForm}
            >
              Return To Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}