// components/dashboard/.jsx
"use client"
import { Button } from "@/components/ui/button";

interface PaginationButtonProps {
  number: number;
  currentPage: number;
  onClick: () => void;
}

export function PaginationButton({ number, currentPage, onClick }: PaginationButtonProps) {
  return (
    <Button 
      variant={currentPage === number ? "default" : "outline"} 
      size="sm" 
      onClick={onClick}
      className="w-8 h-8 p-0"
    >
      {number}
    </Button>
  );
}