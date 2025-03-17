"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Filter, MoreVertical, SlidersHorizontal } from "lucide-react"
import { FilterModal } from "./FilterModal"

const dummyData = new Array(50).fill(null).map((_, i) => ({
  guestId: `16bh9489g-${i + 1}`,
  fullName: `Guest ${i + 1}`,
  bookingId: `B00${i + 1}`,
  room: `#${400 + i}`,
  phone: `0705${Math.floor(1000000 + Math.random() * 9000000)}`,
  amount: `₦${(150000 + i * 1000).toLocaleString()}`,
  occupancy: `${1 + (i % 3)} Persons`,
  status: ["Booked", "Checked-in", "Checked-Out"][i % 3],
}))

const perPage = 10

export default function GuestTable() {
  const [search, setSearch] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState("Today")
  const [page, setPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleToggleStatus = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const filteredData = dummyData.filter((guest) => {
    const matchesSearch =
      guest.guestId.toLowerCase().includes(search.toLowerCase()) ||
      guest.fullName.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(guest.status)

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / perPage)
  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-4 p-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search by ID or name"
            className="w-[200px]"
            value={search}
            onChange={handleSearchChange}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[120px] justify-between">
                {dateFilter} <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["Today", "This Week", "This Month"].map((range) => (
                <DropdownMenuItem key={range} onClick={() => setDateFilter(range)}>
                  {range}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {["Checked-in", "Booked", "Checked-Out"].map((status) =>
            statusFilters.includes(status) ? (
              <Badge
                key={status}
                variant="outline"
                className={`${
                  status === "Checked-in"
                    ? "bg-pink-100 text-pink-600"
                    : status === "Booked"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                } cursor-pointer`}
                onClick={() => handleToggleStatus(status)}
              >
                {status} ✕
              </Badge>
            ) : null
          )}
        </div>

        {/* <Button
          variant="outline"
          onClick={() => {
            setSearch("")
            setStatusFilters([])
            setDateFilter("Today")
          }}
        >
          Clear Filters
        </Button> */}
        <Button onClick={() => {setIsFilterOpen(true)}} variant={"outline"}> <SlidersHorizontal /> Filter</Button>
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
          {paginatedData.map((guest, index) => (
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
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Previous
          </Button>
          {[...Array(totalPages).keys()]
            .slice(Math.max(0, page - 2), page + 1)
            .map((i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                className={page === i + 1 ? "bg-yellow-200 text-black" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </Button>
        </div>
      </div>

      <FilterModal open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  )
}