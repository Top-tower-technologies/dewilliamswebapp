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
import { BookCheck } from "lucide-react";

export default function ReservationCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [open, setOpen] = useState(false)

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };


  return (
    <MainLayout buttonText={"text"} buttonVisible={true}>
      <div className="w-full h-[70vh] grid place-items-center">
        <div className="flex flex-col items-center p-10 border rounded-xl shadow-md bg-white max-w-2/3 mx-auto">
          <div className="w-full flex items-center justify-between py-4 mb-4">
            <p className="text-lg font-medium">Enter Reservation Code</p>

            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg" onClick={() => setOpen(true)}>
              Confirm Reservation
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
                className="w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            ))}
          </div>

          <p className="text-gray-500 text-xs mt-3">You need the 6 digit code sent to the customer’s Mail to initiate check-in.</p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="grid place-items-center space-y-3 p-9 max-w-sm">
          <div className="p-8 bg-[#FFD4001A] rounded-full grid place-items-start">

            {/* <TriangleAlert  /> */}
            <BookCheck size={70} className="text-[#FFD400]" />
          </div>
          {/* <DialogHeader> */}
          <DialogTitle className="text-2xl">Booking Confirmed</DialogTitle>
          <div className="space-y-2 text-black">
            <DialogDescription className="text-center text-md text-black">
              <strong>Client’s Name:</strong> Oyefeso Afolabi
            </DialogDescription>
            <DialogDescription className="text-center text-md text-black">
              <strong>Assigned Room:</strong> 401
            </DialogDescription>
            <DialogDescription className="text-center text-md text-black">
              <strong>Stay:</strong> 4days, 2 Guests
            </DialogDescription>
          </div>
          {/* </DialogHeader> */}

          <div className="grid space-y-2">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg" onClick={() => { setOpen(false) }}>Return To Home</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}