import { NextResponse } from 'next/server';

interface CategoryMetrics {
  name: string;
  count: number;
  avgResolutionTime: number;
  satisfaction: number;
}

// Mock data generator for daily report
function generateMockDailyData(date: string) {
  const totalConversations = Math.floor(Math.random() * 500) + 200; // Random between 200-700
  const containedByBot = Math.floor(Math.random() * (totalConversations * 0.8)); // Up to 80% contained
  const notContainedByBot = Math.floor(Math.random() * (totalConversations - containedByBot));
  const escalatedToAgent = totalConversations - containedByBot - notContainedByBot;

  // Generate hourly distribution
  const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: Math.floor(Math.random() * (totalConversations / 8)) // Distribute across 24 hours
  }));

  // Top categories with metrics
  const categories: CategoryMetrics[] = [
    { 
      name: 'Technical Support',
      count: Math.floor(Math.random() * 200) + 50,
      avgResolutionTime: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
      satisfaction: Math.random() * 2 + 3 // 3-5 rating
    },
    {
      name: 'Account Access',
      count: Math.floor(Math.random() * 150) + 30,
      avgResolutionTime: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
      satisfaction: Math.random() * 2 + 3
    },
    {
      name: 'Billing',
      count: Math.floor(Math.random() * 100) + 20,
      avgResolutionTime: Math.floor(Math.random() * 900) + 600, // 10-25 minutes
      satisfaction: Math.random() * 2 + 3
    },
    {
      name: 'Product Information',
      count: Math.floor(Math.random() * 80) + 15,
      avgResolutionTime: Math.floor(Math.random() * 240) + 120, // 2-6 minutes
      satisfaction: Math.random() * 2 + 3
    }
  ];

  // Performance metrics
  const performance = {
    avgResponseTime: Math.floor(Math.random() * 20) + 10, // 10-30 seconds
    avgResolutionTime: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
    avgMessagesPerConversation: Math.floor(Math.random() * 6) + 4, // 4-10 messages
    peakHourLoad: Math.max(...hourlyDistribution.map(h => h.count)),
    satisfactionScore: Math.round((Math.random() * 1 + 4) * 10) / 10, // 4.0-5.0
    firstContactResolutionRate: Math.round((Math.random() * 20 + 70) * 10) / 10 // 70-90%
  };

  // User engagement
  const userEngagement = {
    returningUsers: Math.floor(totalConversations * (Math.random() * 0.3 + 0.1)), // 10-40% returning
    avgUserEngagementTime: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
    multipleQueriesUsers: Math.floor(totalConversations * (Math.random() * 0.2 + 0.05)) // 5-25% with multiple queries
  };

  return {
    date,
    totalConversations,
    containedByBot,
    notContainedByBot,
    escalatedToAgent,
    hourlyDistribution,
    categories,
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
