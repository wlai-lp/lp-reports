'use client';

import { useState } from 'react';
import { DateRange } from '@/types/dashboard';

interface BranchFilter {
  dateRange: DateRange;
  selectedBranches: string[];
}

export default function BranchReport() {
  const [filter, setFilter] = useState<BranchFilter>({
    dateRange: {
      startDate: '',
      endDate: ''
    },
    selectedBranches: []
  });
  const [loading, setLoading] = useState(false);

  // Mock branches data - replace with actual data from API
  const branches = [
    'Main Street Branch',
    'Downtown Branch',
    'West Side Branch',
    'East End Branch'
  ];

  const handleDateChange = (field: keyof DateRange) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilter(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: e.target.value
      }
    }));
  };

  const handleBranchToggle = (branch: string) => {
    setFilter(prev => ({
      ...prev,
      selectedBranches: prev.selectedBranches.includes(branch)
        ? prev.selectedBranches.filter(b => b !== branch)
        : [...prev.selectedBranches, branch]
    }));
  };

  const handleSubmit = async () => {
    if (!filter.dateRange.startDate || !filter.dateRange.endDate || filter.selectedBranches.length === 0) {
      return;
    }

    setLoading(true);
    try {
      // API call will be implemented here
    } catch (error) {
      console.error('Error fetching branch report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Branch Report</h1>
          
          {/* Filters */}
          <div className="space-y-6 mb-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={filter.dateRange.startDate}
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
                  value={filter.dateRange.endDate}
                  onChange={handleDateChange('endDate')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Branches
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {branches.map(branch => (
                  <div key={branch} className="flex items-center">
                    <input
                      type="checkbox"
                      id={branch}
                      checked={filter.selectedBranches.includes(branch)}
                      onChange={() => handleBranchToggle(branch)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={branch} className="ml-2 block text-sm text-gray-900">
                      {branch}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div>
              <button
                onClick={handleSubmit}
                disabled={loading || !filter.dateRange.startDate || !filter.dateRange.endDate || filter.selectedBranches.length === 0}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                Select date range and branches, then click Generate Report to view branch statistics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
