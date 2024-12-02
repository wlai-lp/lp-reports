import { Bar } from 'react-chartjs-2';

interface CategoryDetailsProps {
  category: string;
  data: {
    subCategories: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
    timeDistribution: Array<{
      date: string;
      count: number;
    }>;
  };
  onClose: () => void;
}

export default function CategoryDetails({ category, data, onClose }: CategoryDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{category} Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Sub-categories Chart */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sub-categories Distribution</h3>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: data.subCategories.map(sub => sub.name),
                  datasets: [
                    {
                      label: 'Number of Conversations',
                      data: data.subCategories.map(sub => sub.count),
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      borderColor: 'rgb(59, 130, 246)',
                      borderWidth: 1,
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
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Time Distribution Chart */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Time Distribution</h3>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: data.timeDistribution.map(item => item.date),
                  datasets: [
                    {
                      label: 'Conversations Over Time',
                      data: data.timeDistribution.map(item => item.count),
                      backgroundColor: 'rgba(16, 185, 129, 0.8)',
                      borderColor: 'rgb(16, 185, 129)',
                      borderWidth: 1,
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
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Sub-categories Table */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub-category
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.subCategories.map((sub, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {sub.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {sub.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
