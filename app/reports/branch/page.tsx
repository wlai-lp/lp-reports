'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DateRange } from '@/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BranchDataPoint {
  date: string;
  count: number;
  branch: string;
}

interface BranchReportData {
  branches: string[];
  totalCount: number;
  averagePerDay: number;
  trend: BranchDataPoint[];
  dateRange: DateRange;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function BranchReport() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BranchReportData | null>(null);
  const [availableBranches] = useState<string[]>([
    'Main Branch',
    'Downtown',
    'West Side',
    'East Side',
    'North Branch',
    'South Branch'
  ]);

  const handleDateChange = (field: keyof DateRange) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranches(prev => {
      if (prev.includes(branch)) {
        return prev.filter(b => b !== branch);
      }
      return [...prev, branch];
    });
  };

  const fetchBranchData = async () => {
    if (!dateRange.startDate || !dateRange.endDate || selectedBranches.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/reports/branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branches: selectedBranches,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch branch data');
      }

      setData(result.data);
    } catch (error) {
      console.error('Error fetching branch report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate random colors for branches
  const getBranchColor = (index: number, alpha: number = 1) => {
    const colors = [
      `rgba(59, 130, 246, ${alpha})`,   // blue
      `rgba(34, 197, 94, ${alpha})`,    // green
      `rgba(234, 179, 8, ${alpha})`,    // yellow
      `rgba(168, 85, 247, ${alpha})`,   // purple
      `rgba(239, 68, 68, ${alpha})`,    // red
      `rgba(14, 165, 233, ${alpha})`,   // light blue
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Branch Report</h1>
          <p className="text-gray-600 mb-6">Compare performance across different branches</p>
          
          {/* Controls Section */}
          <div className="space-y-6 mb-8">
            {/* Date Range Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  onClick={fetchBranchData}
                  disabled={loading || !dateRange.startDate || !dateRange.endDate || selectedBranches.length === 0}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Update Report'}
                </button>
              </div>
            </div>

            {/* Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Branches to Compare
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {availableBranches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => handleBranchChange(branch)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      selectedBranches.includes(branch)
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Report Content */}
          {data && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-600">Total Conversations</h3>
                  <p className="mt-2 text-3xl font-semibold text-blue-900">{data.totalCount}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-600">Average Per Day</h3>
                  <p className="mt-2 text-3xl font-semibold text-green-900">{data.averagePerDay}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-600">Date Range</h3>
                  <p className="mt-2 text-sm text-purple-900">
                    {formatDate(data.dateRange.startDate)} - {formatDate(data.dateRange.endDate)}
                  </p>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Trend by Branch</h3>
                <div className="h-[400px]">
                  <Line
                    data={{
                      labels: [...new Set(data.trend.map(point => formatDate(point.date)))],
                      datasets: selectedBranches.map((branch, index) => ({
                        label: branch,
                        data: data.trend
                          .filter(point => point.branch === branch)
                          .map(point => point.count),
                        borderColor: getBranchColor(index),
                        backgroundColor: getBranchColor(index, 0.1),
                        tension: 0.3,
                        fill: true,
                      })),
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          title: {
                            display: true,
                            text: 'Date',
                          },
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                          },
                        },
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Number of Conversations',
                          },
                        },
                      },
                      interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
