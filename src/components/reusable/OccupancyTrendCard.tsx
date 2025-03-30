// components/dashboard/OccupancyTrendCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OccupancyChart } from "./OccupancyChart";

export function OccupancyTrendCard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Occupancy Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full relative">
          <OccupancyChart />
        </div>
      </CardContent>
    </Card>
  );
}