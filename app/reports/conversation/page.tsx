'use client';

import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';

interface ConversationDetail {
  id: string;
  timestamp: string;
  status: 'contained' | 'not_contained' | 'escalated';
  category: string;
  duration: number;
  userMessages: number;
  botMessages: number;
}

interface ConversationReportData {
  date: string;
  conversations: ConversationDetail[];
}

export default function ConversationReport() {
  // const searchParams = useSearchParams();
  const [data, setData] = useState<ConversationReportData | null>(null);
  const [loading, setLoading] = useState(false);

  // const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const date = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/reports/conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch conversation report');
        }

        setData(result.data);
      } catch (error) {
        console.error('Error fetching conversation report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [date]);

  const getStatusColor = (status: ConversationDetail['status']) => {
    switch (status) {
      case 'contained':
        return 'text-green-600 bg-green-50';
      case 'not_contained':
        return 'text-yellow-600 bg-yellow-50';
      case 'escalated':
        return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Conversation Detail Report</h1>
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
          ) : data?.conversations.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.conversations.map((conv) => (
                    <tr key={conv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(conv.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(conv.status)}`}>
                          {conv.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conv.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round(conv.duration / 60)} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conv.userMessages + conv.botMessages}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No conversations found for the selected date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
