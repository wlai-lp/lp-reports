'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface DailyReportData {
  date: string;
  totalConversations: number;
  containedByBot: number;
  notContainedByBot: number;
  escalatedToAgent: number;
}

export default function DailyReport() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
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

        setData(result.data);
      } catch (error) {
        console.error('Error fetching daily report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [date]);

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
          ) : data ? (
            <div className="space-y-6">
              {/* Metrics Grid */}
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
