import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentLink: string;
  email?: string;
  amount?: string;
  guestName?: string;
  handleOpenPaymentForm: () => void;
  onPaymentComplete?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onOpenChange,
  paymentLink,
  email,
  amount,
  guestName,
  onPaymentComplete,
  handleOpenPaymentForm
}) => {
  const [copied, setCopied] = useState(false);

  const handleOpenPaymentLink = () => {
    window.open(paymentLink, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleOpenInSameTab = () => {
    window.location.href = paymentLink;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid place-items-center space-y-4 p-8 max-w-md">
        <div className="p-6 bg-[#F0F9FF] rounded-full grid place-items-center">
          <CreditCard size={80} className="text-[#0369A1]" />
        </div>

        <DialogTitle className="text-2xl text-center">Make Payment</DialogTitle>
        
        <DialogDescription className="text-center text-sm space-y-2">
          {guestName && (
            <div>
              <span className="font-medium">Guest:</span> {guestName}
            </div>
          )}
          {email && (
            <div>
              <span className="font-medium">Email:</span> {email}
            </div>
          )}
          {amount && (
            <div>
              <span className="font-medium">Amount:</span> {amount}
            </div>
          )}
          <div className="mt-3 text-gray-600">
            Click the button below to proceed with payment
          </div>
        </DialogDescription>

        <div className="w-full space-y-3">
          {/* Primary action - Open in new tab */}
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleOpenPaymentLink}
          >
            <ExternalLink size={16} />
            Open Payment Link
          </Button>
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleOpenPaymentForm}
          >
            <CreditCard size={16} />
            Physical Payment
          </Button>

          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Link
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleOpenInSameTab}
            >
              Go to Payment
            </Button>
          </div>

          {/* Payment link display */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-600 mb-1">Payment Link:</p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {paymentLink}
            </p>
          </div>

          {/* Actions */}
          <div className="grid space-y-2 pt-2">
            {onPaymentComplete && (
              <Button 
                variant="secondary" 
                onClick={() => {
                  onPaymentComplete();
                  onOpenChange(false);
                }}
              >
                Mark as Paid
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};