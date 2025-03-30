// src/app/page.js
'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MainLayout from '@/components/layout/MainLayout'

export default function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState(null)

  // Generate a grid of time slots for demonstration
  const generateTimeSlots = () => {
    const slots = []
    const rows = 4
    const columns = 6

    for (let row = 0; row < rows; row++) {
      const rowSlots = []
      for (let col = 0; col < columns; col++) {
        // One slot is pre-booked for demo
        const isBooked = row === 0 && col === 0

        rowSlots.push({
          id: `slot-${row}-${col}`,
          time: 'SUN 29',
          isBooked,
          service: isBooked ? 'Full Body Massage' : null,
          duration: '8',
        })
      }
      slots.push(rowSlots)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <MainLayout buttonText={""} buttonVisible={true}>
      <div className="max-w-6xl mx-auto rounded-md shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b bg-[#F9F9F9] pb-4 p-4">
          <h1 className="text-xl font-medium">
            Sunday, 4th of January, 25
          </h1>
          <div className="flex items-center gap-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-32">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="View" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 gap-4 p-4 bg-[#fff]">
          {timeSlots.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-6 gap-4">
              {row.map((slot, colIndex) => (
                <div
                  key={slot.id}
                  className={`
                  border border-dashed rounded-lg p-4 min-h-24 flex flex-col 
                  ${slot.isBooked ? 'bg-yellow-50 border-yellow-200' : ''}
                `}
                >
                  <div className="text-xs text-gray-500 mb-2">{slot.time}</div>

                  {slot.isBooked ? (
                    <div className="mt-auto">
                      <div className="bg-yellow-300 text-yellow-800 rounded-md p-2 text-sm relative">
                        <div className="absolute -top-3 right-2 bg-yellow-400 rounded-full h-6 w-6 flex items-center justify-center text-xs">
                          {slot.duration}
                        </div>
                        {slot.service}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto">
                      <button className="bg-gray-200 hover:bg-gray-300 transition-colors rounded-md p-2 text-sm w-full text-gray-700">
                        Available
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}