'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryMetrics {
  name: string;
  count: number;
  avgResolutionTime: number;
  satisfaction: number;
}

interface DailyReportData {
  date: string;
  totalConversations: number;
  containedByBot: number;
  notContainedByBot: number;
  escalatedToAgent: number;
  hourlyDistribution: { hour: number; count: number }[];
  categories: CategoryMetrics[];
  performance: {
    avgResponseTime: number;
    avgResolutionTime: number;
    avgMessagesPerConversation: number;
    peakHourLoad: number;
    satisfactionScore: number;
    firstContactResolutionRate: number;
  };
  userEngagement: {
    returningUsers: number;
    avgUserEngagementTime: number;
    multipleQueriesUsers: number;
  };
}

export default function DailyReport() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/reports/daily', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch daily report');
        }

        const validatedData: DailyReportData = {
          date: result.data.date || date,
          totalConversations: result.data.totalConversations || 0,
          containedByBot: result.data.containedByBot || 0,
          notContainedByBot: result.data.notContainedByBot || 0,
          escalatedToAgent: result.data.escalatedToAgent || 0,
          hourlyDistribution: result.data.hourlyDistribution || Array(24).fill({ hour: 0, count: 0 }),
          categories: result.data.categories || [],
          performance: {
            avgResponseTime: result.data.performance?.avgResponseTime || 0,
            avgResolutionTime: result.data.performance?.avgResolutionTime || 0,
            avgMessagesPerConversation: result.data.performance?.avgMessagesPerConversation || 0,
            peakHourLoad: result.data.performance?.peakHourLoad || 0,
            satisfactionScore: result.data.performance?.satisfactionScore || 0,
            firstContactResolutionRate: result.data.performance?.firstContactResolutionRate || 0,
          },
          userEngagement: {
            returningUsers: result.data.userEngagement?.returningUsers || 0,
            avgUserEngagementTime: result.data.userEngagement?.avgUserEngagementTime || 0,
            multipleQueriesUsers: result.data.userEngagement?.multipleQueriesUsers || 0,
          },
        };

        setData(validatedData);
      } catch (error) {
        console.error('Error fetching daily report:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching the report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [date]);

  const formatMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daily Report</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading report...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-600">Total Conversations</h3>
                  <p className="mt-2 text-3xl font-semibold text-blue-900">{data.totalConversations}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-600">Contained by Bot</h3>
                  <p className="mt-2 text-3xl font-semibold text-green-900">{data.containedByBot}</p>
                  <p className="text-sm text-green-600">
                    {((data.containedByBot / data.totalConversations) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-600">Not Contained</h3>
                  <p className="mt-2 text-3xl font-semibold text-yellow-900">{data.notContainedByBot}</p>
                  <p className="text-sm text-yellow-600">
                    {((data.notContainedByBot / data.totalConversations) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-600">Escalated to Agent</h3>
                  <p className="mt-2 text-3xl font-semibold text-red-900">{data.escalatedToAgent}</p>
                  <p className="text-sm text-red-600">
                    {((data.escalatedToAgent / data.totalConversations) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Average Response Time</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{data.performance.avgResponseTime}s</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Average Resolution Time</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{formatMinutes(data.performance.avgResolutionTime)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Messages per Conversation</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{data.performance.avgMessagesPerConversation}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Peak Hour Load</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{data.performance.peakHourLoad} conversations</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Satisfaction Score</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{data.performance.satisfactionScore}/5.0</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">First Contact Resolution</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{data.performance.firstContactResolutionRate}%</p>
                  </div>
                </div>
              </div>

              {/* User Engagement */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Returning Users</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{data.userEngagement.returningUsers}</p>
                    <p className="text-sm text-gray-500">
                      {((data.userEngagement.returningUsers / data.totalConversations) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Average Engagement Time</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {formatMinutes(data.userEngagement.avgUserEngagementTime)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Multiple Queries Users</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{data.userEngagement.multipleQueriesUsers}</p>
                    <p className="text-sm text-gray-500">
                      {((data.userEngagement.multipleQueriesUsers / data.totalConversations) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              </div>

              {/* Hourly Distribution Chart */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Distribution</h2>
                <div className="h-[300px]">
                  <Line
                    data={{
                      labels: data.hourlyDistribution.map(h => `${h.hour}:00`),
                      datasets: [
                        {
                          label: 'Conversations',
                          data: data.hourlyDistribution.map(h => h.count),
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
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
                            text: 'Hour of Day',
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
                    }}
                  />
                </div>
              </div>

              {/* Category Performance */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversations</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Resolution Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.categories.map((category) => (
                        <tr key={category.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatMinutes(category.avgResolutionTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.satisfaction.toFixed(1)}/5.0
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No data available for the selected date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
