// components/GuestTable.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, MoreVertical } from "lucide-react"

const data = new Array(10).fill({
  guestId: "16bh9489g",
  fullName: "Oyefeso Afolabi",
  bookingId: "B002",
  room: "#401",
  phone: "07057997839",
  amount: "₦200,000",
  occupancy: "3 Persons",
  status: "Checked-Out", // Booked, Checked-in
})

export default function GuestTable() {
  return (
    <div className="space-y-4 p-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Input placeholder="Search for an ID" className="w-[200px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[120px] justify-between">
                Today <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Today</DropdownMenuItem>
              <DropdownMenuItem>This Week</DropdownMenuItem>
              <DropdownMenuItem>This Month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Badge variant="outline" className="bg-pink-100 text-pink-600">Checked-in ✕</Badge>
          <Badge variant="outline" className="bg-green-100 text-green-600">Booked ✕</Badge>
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Booking ID</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Occupancy</TableHead>
            <TableHead>Reservation</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((guest, index) => (
            <TableRow key={index}>
              <TableCell className="text-blue-600 underline">{guest.guestId}</TableCell>
              <TableCell>{guest.fullName}</TableCell>
              <TableCell>{guest.bookingId}</TableCell>
              <TableCell>{guest.room}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.amount}</TableCell>
              <TableCell>{guest.occupancy}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    guest.status === "Booked"
                      ? "bg-green-100 text-green-600"
                      : guest.status === "Checked-in"
                      ? "bg-pink-100 text-pink-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {guest.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-muted-foreground">Page 1 of 30</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">← Previous</Button>
          <Button variant="default" size="sm" className="bg-yellow-200 text-black">3</Button>
          <Button variant="outline" size="sm">Next →</Button>
        </div>
      </div>
    </div>
  )
}
