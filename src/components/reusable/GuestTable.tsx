"use client";

import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { PaginationButton } from "./PaginationButton";

// =======================
// TYPES
// =======================
type ColumnConfig = {
  key: string;
  header: string;
  type?: string;
  className?: string;
  cellClassName?: string;
  badgeVariant?: (value: any) => string;
  badgeClassName?: (value: any) => string;
};

type ActionConfig = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

type DynamicTableProps = {
  title?: string;
  columns: ColumnConfig[];
  data: any[];
  actions?: ActionConfig[] | ((item: any) => ActionConfig[]);
  paginationMode?: 'client' | 'server' | 'none';
  itemsPerPage?: number;
  paginationInfo?: PaginationInfo;
  onPageChange?: (page: number) => void;
  showCheckbox?: boolean;
  showActions?: boolean;
  onRowAction?: (actionKey: string, item: any, index: number) => void;
  renderCell?: (item: any, column: ColumnConfig) => React.ReactNode;
  loading?: boolean;
};

// =======================
// COMPONENT
// =======================
export function DynamicTable({
  title,
  columns,
  data,
  actions = [],
  paginationMode = 'client',
  itemsPerPage = 8,
  paginationInfo,
  onPageChange,
  showCheckbox = true,
  showActions = true,
  onRowAction,
  renderCell,
  loading = false,
}: DynamicTableProps) {
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSelectedRows(new Set());
  }, [data]);

  // =======================
  // PAGINATION LOGIC
  // =======================
  const getCurrentPageData = () => {
    if (paginationMode === 'client') {
      const start = (clientCurrentPage - 1) * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
    }
    return data;
  };

  const getPaginationData = (): PaginationInfo | null => {
    if (paginationMode === 'server' && paginationInfo) return paginationInfo;

    if (paginationMode === 'client') {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      return {
        currentPage: clientCurrentPage,
        totalPages,
        totalItems: data.length,
        itemsPerPage,
      };
    }

    return null;
  };

  const handlePageChange = (page: number) => {
    if (paginationMode === 'client') {
      setClientCurrentPage(page);
    } else if (paginationMode === 'server') {
      onPageChange?.(page);
    }
  };

  // =======================
  // ROW SELECTION
  // =======================
  const toggleRowSelection = (index: number) => {
    const newSet = new Set(selectedRows);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setSelectedRows(newSet);
  };

  const toggleAllSelection = () => {
    const allSelected = selectedRows.size === currentData.length;
    setSelectedRows(allSelected ? new Set() : new Set(currentData.map((_, i) => i)));
  };

  // =======================
  // ACTION LOGIC
  // =======================
  const getActionsForRow = (item: any): ActionConfig[] => {
    return typeof actions === 'function' ? actions(item) : actions;
  };

  // =======================
  // CELL RENDERING
  // =======================
  const defaultRenderCell = (item: any, column: ColumnConfig) => {
    if (column.type === 'badge') {
      const allowedVariants = ["outline", "default", "secondary", "destructive"] as const;
      const variant = allowedVariants.includes(column.badgeVariant?.(item[column.key]) as any)
        ? (column.badgeVariant?.(item[column.key]) as typeof allowedVariants[number])
        : "outline";

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

  const currentData = getCurrentPageData();
  const pagination = getPaginationData();

  // =======================
  // PAGINATION BUTTONS
  // =======================
  const generatePaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return [];

    const { currentPage, totalPages } = pagination;
    const buttons = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <PaginationButton key={i} number={i} currentPage={currentPage} onClick={() => handlePageChange(i)} />
        );
      }
    } else {
      [1, 2, 3].forEach(i =>
        buttons.push(
          <PaginationButton key={i} number={i} currentPage={currentPage} onClick={() => handlePageChange(i)} />
        )
      );
      buttons.push(<div key="ellipsis" className="px-2">...</div>);
      [totalPages - 2, totalPages - 1, totalPages].forEach(i =>
        buttons.push(
          <PaginationButton key={i} number={i} currentPage={currentPage} onClick={() => handlePageChange(i)} />
        )
      );
    }

    return buttons;
  };

  // =======================
  // RENDER
  // =======================
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

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
              {columns.map((col, i) => (
                <TableHead key={i} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              {showActions && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0)}
                  className="text-center py-8 text-gray-500"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, rowIndex) => {
                const rowActions = getActionsForRow(item);
                return (
                  <TableRow key={rowIndex}>
                    {showCheckbox && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(rowIndex)}
                          onCheckedChange={() => toggleRowSelection(rowIndex)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.cellClassName}>
                        {cellRenderer(item, column)}
                      </TableCell>
                    ))}
                    {showActions && rowActions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions.map((action, i) => (
                              <DropdownMenuItem
                                key={i}
                                onClick={() => onRowAction?.(action.key, item, rowIndex)}
                                className="flex items-center gap-2"
                              >
                                {action.icon}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
            {paginationMode === "server" && (
              <span className="ml-2">({pagination.totalItems} total items)</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === 1 || loading}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            {generatePaginationButtons()}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages || loading}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
