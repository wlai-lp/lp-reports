'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DashboardData, DashboardResponse } from '@/types/dashboard';
import CategoryDetails from '../components/CategoryDetails';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<any>(null);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    handleSubmit();
  }, []); // Run once on component mount

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dashboard/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      const result: DashboardResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      setData(result.data ?? null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBarClick = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      const response = await fetch('/api/dashboard/category-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          startDate,
          endDate,
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch category details');
      }

      setCategoryDetails(result.data);
    } catch (error) {
      console.error('Error fetching category details:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch category details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{process.env.NEXT_PUBLIC_DASHBOARD_SUBTITLE}</h1>
          
          {/* Date Range Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Conversations */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <h3 className="text-lg font-medium">Total Conversations</h3>
                  <p className="text-3xl font-bold mt-2">{data.totalConversations}</p>
                  <p className="text-sm mt-1">Last updated: {new Date(data.lastUpdated).toLocaleString()}</p>
                </div>

                {/* Top Subjects */}
                {data.topSubjects.map((subject, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br rounded-lg p-4 text-white ${
                      index === 0
                        ? 'from-green-500 to-green-600'
                        : index === 1
                        ? 'from-yellow-500 to-yellow-600'
                        : 'from-purple-500 to-purple-600'
                    }`}
                  >
                    <h3 className="text-lg font-medium">{subject.name}</h3>
                    <p className="text-3xl font-bold mt-2">{subject.count}</p>
                    <p className="text-sm mt-1">{subject.percentage}% of total</p>
                  </div>
                ))}
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
                <div className="h-[400px]">
                  <Bar
                    data={{
                      labels: data.topSubjects.map(subject => subject.name),
                      datasets: [
                        {
                          label: 'Number of Conversations',
                          data: data.topSubjects.map(subject => subject.count),
                          backgroundColor: [
                            'rgba(34, 197, 94, 0.8)',  // green
                            'rgba(234, 179, 8, 0.8)',  // yellow
                            'rgba(168, 85, 247, 0.8)', // purple
                          ],
                          borderColor: [
                            'rgb(34, 197, 94)',
                            'rgb(234, 179, 8)',
                            'rgb(168, 85, 247)',
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                      onClick: (event, elements) => {
                        if (elements && elements.length > 0) {
                          const index = elements[0].index;
                          const category = data.topSubjects[index].name;
                          handleBarClick(category);
                        }
                      },
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Category Details Modal */}
          {selectedCategory && categoryDetails && (
            <CategoryDetails
              category={selectedCategory}
              data={categoryDetails}
              onClose={() => {
                setSelectedCategory(null);
                setCategoryDetails(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
