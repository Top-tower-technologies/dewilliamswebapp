// components/ui/DynamicTable.jsx
"use client"
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { PaginationButton } from "./PaginationButton";

type ColumnType = {
  key: string;
  header: string;
  type?: string;
  className?: string;
  cellClassName?: string;
  badgeVariant?: (value: any) => string;
  badgeClassName?: (value: any) => string;
};

type ActionType = {
  key: string;
  label: string;
};

type DynamicTableProps = {
  title?: string;
  columns: ColumnType[];
  data: any[];
  actions?: ActionType[];
  itemsPerPage?: number;
  showCheckbox?: boolean;
  showActions?: boolean;
  onRowAction?: (actionKey: string, item: any, index: number) => void;
  renderCell?: (item: any, column: ColumnType) => React.ReactNode;
};

export function DynamicTable({ 
  title,
  columns, 
  data, 
  actions = [], 
  itemsPerPage = 10,
  showCheckbox = true,
  showActions = true,
  onRowAction,
  renderCell
}: DynamicTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Handle row selection
  const toggleRowSelection = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentData.map((_, index) => index)));
    }
  };

  // Default cell renderer
  const defaultRenderCell = (item: any, column: ColumnType) => {
    if (column.type === 'badge') {
      const allowedVariants = ["outline", "default", "secondary", "destructive"] as const;
      const variantValue = column.badgeVariant?.(item[column.key]);
      const variant = allowedVariants.includes(variantValue as any) ? variantValue as typeof allowedVariants[number] : "outline";
      const className = column.badgeClassName?.(item[column.key]) || "";
      return (
        <Badge variant={variant} className={className}>
          {item[column.key]}
        </Badge>
      );
    }
    return item[column.key];
  };

  const cellRenderer = renderCell || defaultRenderCell;

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <PaginationButton
            key={i}
            number={i}
            currentPage={currentPage}
            onClick={() => setCurrentPage(i)}
          />
        );
      }
    } else {
      // Show first few pages, ellipsis, and last few pages
      for (let i = 1; i <= Math.min(3, totalPages); i++) {
        buttons.push(
          <PaginationButton
            key={i}
            number={i}
            currentPage={currentPage}
            onClick={() => setCurrentPage(i)}
          />
        );
      }
      
      if (totalPages > 6) {
        buttons.push(<div key="ellipsis" className="px-2">...</div>);
      }
      
      for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
        buttons.push(
          <PaginationButton
            key={i}
            number={i}
            currentPage={currentPage}
            onClick={() => setCurrentPage(i)}
          />
        );
      }
    }
    
    return buttons;
  };

  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      
      <Table>
        <TableHeader>
          <TableRow>
            {showCheckbox && (
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedRows.size === currentData.length && currentData.length > 0}
                  onCheckedChange={toggleAllSelection}
                />
              </TableHead>
            )}
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {showActions && actions.length > 0 && (
              <TableHead className="w-12"></TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item, index) => (
            <TableRow key={index}>
              {showCheckbox && (
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.has(index)}
                    onCheckedChange={() => toggleRowSelection(index)}
                  />
                </TableCell>
              )}
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className={column.cellClassName}>
                  {cellRenderer(item, column)}
                </TableCell>
              ))}
              {showActions && actions.length > 0 && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, actionIndex) => (
                        <DropdownMenuItem 
                          key={actionIndex}
                          onClick={() => onRowAction?.(action.key, item, index)}
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {generatePaginationButtons()}
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}