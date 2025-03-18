'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export function FilterModal({ open, onClose }: { open: boolean; onClose: () => any }) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  });

  const [selectedAmounts, setSelectedAmounts] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);
  const [roomInput, setRoomInput] = useState('');

  const amountOptions = [
    { label: 'Less than ₦50,000', value: '<50k' },
    { label: 'Between ₦50,000 - ₦200,000', value: '50-200k' },
    { label: 'Between ₦250,000 - ₦300,000', value: '250-300k' },
    { label: 'Above ₦300,000', value: '>300k' },
  ];

  const statusOptions = [
    { label: 'Booked', color: 'bg-green-200', value: 'Booked' },
    { label: 'Checked-in', color: 'bg-pink-300', value: 'Checked-in' },
    { label: 'Checked-Out', color: 'bg-gray-300', value: 'Checked-Out' },
    { label: 'Cancelled', color: 'bg-red-200', value: 'Cancelled' },
  ];

  const handleRoomAdd = () => {
    if (roomInput && !roomNumbers.includes(roomInput)) {
      setRoomNumbers([...roomNumbers, roomInput]);
      setRoomInput('');
    }
  };

  const handleApply = () => {
    const filters = {
      dateRange,
      selectedAmounts,
      selectedStatuses,
      roomNumbers,
    };
    console.log('Apply filters:', filters);
    onClose();
  };

  const handleReset = () => {
    setDateRange({ from: new Date(), to: new Date() });
    setSelectedAmounts([]);
    setSelectedStatuses([]);
    setRoomNumbers([]);
    setRoomInput('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Filter</span>
          </DialogTitle>
        </DialogHeader>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Date</label>
          <div className="flex items-center gap-2">
            {['from', 'to'].map((key) => (
              <Popover key={key}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-[140px] justify-start text-left', !dateRange[key as 'from' | 'to'] && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange[key as 'from' | 'to']
                      ? format(dateRange[key as 'from' | 'to']!, 'dd-MM-yy')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange[key as 'from' | 'to']}
                    onSelect={(date) =>
                      setDateRange((prev) => ({ ...prev, [key]: date }))
                    }
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>

        {/* Amount Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount</label>
          <div className="space-y-2">
            {amountOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedAmounts.includes(opt.value)}
                  onCheckedChange={() =>
                    setSelectedAmounts((prev) =>
                      prev.includes(opt.value)
                        ? prev.filter((v) => v !== opt.value)
                        : [...prev, opt.value]
                    )
                  }
                />
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Reservation</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedStatuses.map((status) => (
              <Badge
                key={status}
                className={cn(
                  'text-xs px-2 py-1 rounded-md',
                  statusOptions.find((s) => s.value === status)?.color
                )}
              >
                {status}{' '}
                <span
                  className="ml-1 cursor-pointer"
                  onClick={() =>
                    setSelectedStatuses((prev) =>
                      prev.filter((s) => s !== status)
                    )
                  }
                >
                  <X className="w-3 h-3 inline" />
                </span>
              </Badge>
            ))}
          </div>
          <div className="space-y-2">
            {statusOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedStatuses.includes(opt.value)}
                  onCheckedChange={() =>
                    setSelectedStatuses((prev) =>
                      prev.includes(opt.value)
                        ? prev.filter((v) => v !== opt.value)
                        : [...prev, opt.value]
                    )
                  }
                />
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Room No</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {roomNumbers.map((num) => (
              <Badge key={num} className="bg-gray-200 text-black">
                {num}{' '}
                <span
                  className="ml-1 cursor-pointer"
                  onClick={() =>
                    setRoomNumbers((prev) => prev.filter((r) => r !== num))
                  }
                >
                  <X className="w-3 h-3 inline" />
                </span>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Enter a number"
            />
            <Button onClick={handleRoomAdd} disabled={!roomInput.trim()}>
              Add
            </Button>
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}