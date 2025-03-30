// components/dashboard/StatCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  previousValue: number | string;
  negative?: boolean
}

export function StatCard({ title, value, change, previousValue, negative = false }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-4xl font-bold flex items-center gap-x-5">
            <h1>
              {value}
            </h1>
            <Badge variant="outline" className={`${negative ? "bg-[#FF2E3B1A] text-[#FF2E3B]" : "bg-blue-50 text-blue-600"} border-0 mr-2 h-[18px]`}>
              {
                negative ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronUp className="h-3 w-3 mr-1" />
              }

              {change}%
            </Badge>
          </div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">

            {previousValue}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



