"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"

interface ReservationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const ReservationModal = ({ open, onOpenChange }: ReservationModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-6 rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-lg font-semibold">
                        Enter Reservation Code
                    </DialogTitle>
                </DialogHeader>

                <div className="flex justify-center my-6">
                    <InputOTP maxLength={6}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className="flex justify-center">
                    <Button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md"
                        onClick={() => onOpenChange(false)}
                    >
                        Confirm Reservation
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center mt-3">
                    You need the 6 digit code sent to the customer’s Mail to initiate check-in.
                </p>
            </DialogContent>
        </Dialog>
    )
}
