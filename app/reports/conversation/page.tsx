'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface ConversationDetail {
  id: string;
  timestamp: string;
  status: 'contained' | 'not_contained' | 'escalated';
  category: string;
  subcategory: string;
  duration: number;
  userMessages: number;
  botMessages: number;
}

interface Category {
  name: string;
  subcategories: string[];
}

interface ConversationReportData {
  date: string;
  conversations: ConversationDetail[];
  categories: Category[];
}

export default function ConversationReport() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConversationReportContent />
    </Suspense>
  );
}

function ConversationReportContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ConversationReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/reports/conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            date,
            category: selectedCategory || undefined,
            subcategory: selectedSubcategory || undefined,
          }),
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
  }, [date, selectedCategory, selectedSubcategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Conversation Detail Report</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Filters */}
          {data && (
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Categories</option>
                  {data.categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCategory && (
                <div className="flex-1">
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Subcategories</option>
                    {data.categories
                      .find((c) => c.name === selectedCategory)
                      ?.subcategories.map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{conv.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{conv.subcategory}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatMinutes(conv.duration)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conv.userMessages + conv.botMessages} ({conv.userMessages} user, {conv.botMessages} bot)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No conversations found for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
