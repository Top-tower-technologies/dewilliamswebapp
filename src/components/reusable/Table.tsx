// components/dashboard/GuestTable.jsx
"use client"
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { PaginationButton } from "./PaginationButton";

interface Guest {
  id: string;
  name: string;
  phone: string;
  room: string;
  status: string;
}

export function GuestTable({ guestData }: { guestData: Guest[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Guest ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Room No</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guestData.map((guest, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{guest.id}</TableCell>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.room}</TableCell>
              <TableCell>
                <Badge 
                  variant={guest.status === "Pending" ? "secondary" : "outline"} 
                  className={guest.status === "Checked in" ? "bg-green-50 text-green-600 border-0" : ""}
                >
                  {guest.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit guest</DropdownMenuItem>
                    <DropdownMenuItem>Check out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Page 1 of 30
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <PaginationButton number={1} currentPage={currentPage} onClick={() => setCurrentPage(1)} />
          <PaginationButton number={2} currentPage={currentPage} onClick={() => setCurrentPage(2)} />
          <PaginationButton number={3} currentPage={currentPage} onClick={() => setCurrentPage(3)} />
          <div className="px-2">...</div>
          <PaginationButton number={10} currentPage={currentPage} onClick={() => setCurrentPage(10)} />
          <PaginationButton number={11} currentPage={currentPage} onClick={() => setCurrentPage(11)} />
          <PaginationButton number={12} currentPage={currentPage} onClick={() => setCurrentPage(12)} />
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </>
  );
}