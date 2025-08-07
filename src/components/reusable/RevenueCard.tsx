"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import axiosInstance from '@/api/axiosInstance';

// Note: Make sure to import axiosInstance in your component
// import axiosInstance from '@/lib/axios' or wherever you have it configured

interface RevenueData {
  statusCode: number;
  message: string;
  data: {
    revenue: string;
  };
  success: boolean;
}

const RevenueCard: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState<string>('0.00');
  const [filteredRevenue, setFilteredRevenue] = useState<string>('0.00');
  const [loading, setLoading] = useState<boolean>(false);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

  // Fetch total revenue without date filter
  const fetchTotalRevenue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get('/staff/revenue', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      });

      const data: RevenueData = response.data;
      
      if (data.success) {
        console.log('Total Revenue Response:', data); // Debug log
        const revenueValue = data.data?.revenue || '0';
        console.log('Revenue Value:', revenueValue); // Debug log
        setTotalRevenue(revenueValue.toString());
        // If no filter is applied, show total revenue as filtered revenue too
        if (!startDate || !endDate) {
          setFilteredRevenue(revenueValue.toString());
        }
      } else {
        throw new Error(data.message || 'Failed to fetch revenue data');
      }
    } catch (err: any) {
      console.error('API Error:', err); // Debug log
      console.error('Error response:', err.response?.data); // Debug log
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setTotalRevenue('0');
      setFilteredRevenue('0');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered revenue with date range
  const fetchFilteredRevenue = async (start: Date, end: Date) => {
    setFilterLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        start_date: format(start, 'yyyy-MM-dd'),
        end_date: format(end, 'yyyy-MM-dd'),
      });

      const response = await axiosInstance.get(`/staff/revenue?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` }
      });

      const data: RevenueData = response.data;
      
      if (data.success) {
        console.log('Filtered Revenue Response:', data); // Debug log
        const revenueValue = data.data?.revenue || '0';
        console.log('Filtered Revenue Value:', revenueValue); // Debug log
        setFilteredRevenue(revenueValue.toString());
      } else {
        throw new Error(data.message || 'Failed to fetch filtered revenue data');
      }
    } catch (err: any) {
      console.error('Filter API Error:', err); // Debug log
      console.error('Filter Error response:', err.response?.data); // Debug log
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setFilteredRevenue('0');
    } finally {
      setFilterLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTotalRevenue();
  }, []);

  // Apply filter when both dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      fetchFilteredRevenue(startDate, endDate);
    }
  }, [startDate, endDate]);

  const formatCurrency = (value: string): string => {
    // Handle empty or invalid values
    if (!value || value === 'undefined' || value === 'null') {
      return '₦0.00';
    }
    
    // Remove any existing currency symbols and commas
    const cleanValue = value.toString().replace(/[₦,$]/g, '').trim();
    
    // Parse the number
    const num = parseFloat(cleanValue);
    
    // Check if parsing was successful
    if (isNaN(num)) {
      console.error('Invalid revenue value:', value);
      return '₦0.00';
    }
    
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const clearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredRevenue(totalRevenue);
  };

  const refreshData = () => {
    fetchTotalRevenue();
    if (startDate && endDate) {
      fetchFilteredRevenue(startDate, endDate);
    }
  };

  const hasDateFilter = startDate && endDate;

  return (
    <div className="w-full">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Revenue Dashboard</h1>
          <p className="text-slate-600">Monitor your total revenue and filter by date range</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Total Revenue Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Total Revenue</CardTitle>
                    <CardDescription>All-time revenue generated</CardDescription>
                  </div>
                </div>
                <Button
                  onClick={refreshData}
                  disabled={loading || filterLoading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={cn("h-4 w-4", (loading || filterLoading) && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-2">
              {loading ? (
                <div className="text-4xl font-bold text-slate-400 animate-pulse mb-4">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-4xl font-bold text-red-500 mb-4">
                  Error
                </div>
              ) : (
                <div className="text-5xl font-bold text-slate-900 mb-4">
                  {formatCurrency(totalRevenue)}
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Filtered Revenue Display */}
              {hasDateFilter && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-700">Filtered Revenue</h3>
                    <div className="text-sm text-slate-500">
                      {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
                    </div>
                  </div>
                  {filterLoading ? (
                    <div className="text-2xl font-bold text-slate-400 animate-pulse">
                      Loading...
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(filteredRevenue)}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date Filter Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Filter className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Date Filter</CardTitle>
                  <CardDescription>Filter revenue by date range</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Start Date</label>
                <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'MMM dd, yyyy') : 'Select start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setIsStartCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">End Date</label>
                <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'MMM dd, yyyy') : 'Select end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setIsEndCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        startDate ? date < startDate : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={clearFilter}
                  variant="outline"
                  size="sm"
                  disabled={!hasDateFilter}
                  className="flex-1"
                >
                  Clear Filter
                </Button>
              </div>

              {/* Filter Status */}
              {hasDateFilter && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 font-medium">Filter Applied</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Showing revenue from {format(startDate, 'MMM dd, yyyy')} to {format(endDate, 'MMM dd, yyyy')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {loading ? '...' : formatCurrency(totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Filtered Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filterLoading ? '...' : formatCurrency(filteredRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Filter className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Filter Status</p>
                  <p className="text-lg font-semibold text-slate-700">
                    {hasDateFilter ? 'Active' : 'None'}
                  </p>
                </div>
                <div className={cn(
                  "p-3 rounded-full",
                  hasDateFilter ? "bg-orange-100" : "bg-slate-100"
                )}>
                  <CalendarIcon className={cn(
                    "h-6 w-6",
                    hasDateFilter ? "text-orange-600" : "text-slate-400"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;