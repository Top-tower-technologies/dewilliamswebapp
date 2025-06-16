// ========================================
// CORE DYNAMIC TABLE COMPONENT WITH SERVER-SIDE PAGINATION
// ========================================

"use client"
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { PaginationButton } from "./PaginationButton";

/**
 * Core reusable table component with dynamic configuration and pagination support
 */
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
  
  // Pagination props
  paginationMode?: 'client' | 'server' | 'none';
  itemsPerPage?: number;
  paginationInfo?: PaginationInfo | any;
  onPageChange?: (page: number) => void;
  
  // Other props
  showCheckbox?: boolean;
  showActions?: boolean;
  onRowAction?: (actionKey: string, item: any, index: number) => void;
  renderCell?: (item: any, column: ColumnConfig) => React.ReactNode ;
  loading?: boolean;
};

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
  loading = false
}: DynamicTableProps) {
  // Client-side pagination state
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Reset selected rows when data changes
  useEffect(() => {
    setSelectedRows(new Set());
  }, [data]);

  // ========================================
  // PAGINATION LOGIC
  // ========================================
  const getCurrentPageData = () => {
    if (paginationMode === 'client') {
      const startIndex = (clientCurrentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return data.slice(startIndex, endIndex);
    }
    // For server-side pagination or no pagination, return all data
    return data;
  };

  const getPaginationData = () => {
    if (paginationMode === 'server' && paginationInfo) {
      return paginationInfo;
    }
    
    if (paginationMode === 'client') {
      return {
        currentPage: clientCurrentPage,
        totalPages: Math.ceil(data.length / itemsPerPage),
        totalItems: data.length,
        itemsPerPage
      };
    }
    
    // No pagination
    return null;
  };

  const handlePageChange = (page: number) => {
    if (paginationMode === 'client') {
      setClientCurrentPage(page);
    } else if (paginationMode === 'server' && onPageChange) {
      onPageChange(page);
    }
  };

  // ========================================
  // ROW SELECTION LOGIC
  // ========================================
  const currentData = getCurrentPageData();
  const pagination = getPaginationData();

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

  // ========================================
  // ACTION RESOLUTION LOGIC
  // ========================================
  const getActionsForRow = (item: any): ActionConfig[] => {
    if (typeof actions === 'function') {
      return actions(item);
    }
    return Array.isArray(actions) ? actions : [];
  };

  // ========================================
  // CELL RENDERING LOGIC
  // ========================================
  const defaultRenderCell = (item: any, column: ColumnConfig) => {
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

  // ========================================
  // PAGINATION BUTTONS GENERATION
  // ========================================
  const generatePaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return [];
    
    const buttons = [];
    const maxVisible = 5;
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <PaginationButton
            key={i}
            number={i}
            currentPage={currentPage}
            onClick={() => handlePageChange(i)}
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
            onClick={() => handlePageChange(i)}
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
            onClick={() => handlePageChange(i)}
          />
        );
      }
    }
    
    return buttons;
  };

  // ========================================
  // MAIN TABLE RENDER
  // ========================================
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
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {showActions && (
                <TableHead className="w-12"></TableHead>
              )}
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
              currentData.map((item, index) => {
                const rowActions = getActionsForRow(item);
                
                return (
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
                    {showActions && rowActions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions.map((action, actionIndex) => (
                              <DropdownMenuItem 
                                key={actionIndex}
                                onClick={() => onRowAction?.(action.key, item, index)}
                                className="flex items-center gap-2"
                              >
                                {action.icon && action.icon}
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

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
            {paginationMode === 'server' && (
              <span className="ml-2">
                ({pagination.totalItems} total items)
              </span>
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