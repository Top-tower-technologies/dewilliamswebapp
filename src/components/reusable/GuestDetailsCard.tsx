import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { DynamicTable } from "./GuestTable";
import { Input } from "../ui/input";
// ❌ INCORRECT: import { DynamicTable } from "./GuestTable";
// ✅ CORRECT: Import from the actual DynamicTable file

export function GuestDetailsCard({ children }: { children: React.ReactNode }) {
  const [selectedDay, setSelectedDay] = useState("Today");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium flex gap-1"><Input placeholder="Search"/><Button><Search/></Button></CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-32">
                <SelectValue>{selectedDay}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Yesterday">Yesterday</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}