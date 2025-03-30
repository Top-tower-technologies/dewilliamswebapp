// components/dashboard/StatCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  previousValue: number | string;
}

export function StatCard({ title, value, change, previousValue }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-4xl font-bold">{value}</div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-0 mr-2">
              <ChevronUp className="h-3 w-3 mr-1" />
              {change}%
            </Badge>
            {previousValue}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



