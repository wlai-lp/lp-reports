import { NextResponse } from 'next/server';

// Mock categories for consistent data
const categories = [
  'Account Access',
  'Technical Support',
  'Billing',
  'Product Information',
  'Service Issues'
];

// Mock data generator for daily report
function generateMockDailyData(date: string) {
  const totalConversations = Math.floor(Math.random() * 500) + 200; // Random between 200-700
  const containedByBot = Math.floor(Math.random() * (totalConversations * 0.8)); // Up to 80% contained
  const notContainedByBot = Math.floor(Math.random() * (totalConversations - containedByBot));
  const escalatedToAgent = totalConversations - containedByBot - notContainedByBot;

  // Generate hourly distribution
  const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: Math.floor(Math.random() * (totalConversations / 8)) // Distribute conversations across hours
  }));

  // Generate category metrics
  const categoryMetrics = categories.map(name => ({
    name,
    count: Math.floor(Math.random() * (totalConversations / 3)),
    avgResolutionTime: Math.floor(Math.random() * 600) + 300, // 5-15 minutes in seconds
    satisfaction: Math.random() * 2 + 3 // Random score between 3-5
  }));

  // Generate performance metrics
  const performance = {
    avgResponseTime: Math.floor(Math.random() * 30) + 15, // 15-45 seconds
    avgResolutionTime: Math.floor(Math.random() * 600) + 300, // 5-15 minutes in seconds
    avgMessagesPerConversation: Math.floor(Math.random() * 6) + 4, // 4-10 messages
    peakHourLoad: Math.max(...hourlyDistribution.map(h => h.count)),
    satisfactionScore: Math.random() * 1 + 4, // Random score between 4-5
    firstContactResolutionRate: Math.random() * 0.3 + 0.6 // 60-90%
  };

  // Generate user engagement metrics
  const userEngagement = {
    returningUsers: Math.floor(totalConversations * (Math.random() * 0.3 + 0.2)), // 20-50% returning users
    avgUserEngagementTime: Math.floor(Math.random() * 600) + 300, // 5-15 minutes in seconds
    multipleQueriesUsers: Math.floor(totalConversations * (Math.random() * 0.2 + 0.1)) // 10-30% users with multiple queries
  };

  return {
    date,
    totalConversations,
    containedByBot,
    notContainedByBot,
    escalatedToAgent,
    hourlyDistribution,
    categories: categoryMetrics,
    performance,
    userEngagement
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      );
    }

    // In a real application, you would fetch this data from your database
    const reportData = generateMockDailyData(date);

    return NextResponse.json({
      success: true,
      data: reportData
    });

  } catch (error) {
    console.error('Error generating daily report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate daily report' },
      { status: 500 }
    );
  }
}
