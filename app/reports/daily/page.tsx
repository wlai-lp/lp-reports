'use client';

import { useState } from 'react';
import { DateRange } from '@/types/dashboard';

export default function DailyReport() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleDateChange = (field: keyof DateRange) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return;
    }

    setLoading(true);
    try {
      // API call will be implemented here
    } catch (error) {
      console.error('Error fetching daily report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Daily Report</h1>
          
          {/* Date Range Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange('startDate')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange('endDate')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                disabled={loading || !dateRange.startDate || !dateRange.endDate}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="space-y-6">
            {/* Placeholder for report content */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-gray-600 text-center">
                Select a date range and click Generate Report to view daily statistics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
