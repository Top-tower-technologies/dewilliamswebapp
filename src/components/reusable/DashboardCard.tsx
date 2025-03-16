'use client'

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

type DashboardCardProps = {
  title: string
  value: string | number
  subtitle?: string
  percentageChange: string
  isPositive?: boolean
  highlightText?: string
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  percentageChange,
  isPositive = true,
  highlightText
}: DashboardCardProps) {
  return (
    <Card className="w-full rounded-xl shadow-sm">
      <CardContent className="p-5 space-y-3">
        <h4 className="text-sm text-muted-foreground">{title}</h4>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{value}</span>
          <span
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              isPositive
                ? "bg-[#007AFF1A] text-[#007AFF]"
                : "bg-red-100 text-red-600"
            )}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {percentageChange}
          </span>
          <p></p>
        </div>
        {subtitle && <p className="text-xs text-muted-foreground"> <span className="text-sm text-[#007AFF] font-medium">{highlightText}</span> {subtitle}</p>}
      </CardContent>
    </Card>
  )
}