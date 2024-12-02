import { NextResponse } from 'next/server';
import { DashboardData, DashboardResponse, SubjectStats, DateRange, BranchStats } from '@/types/dashboard';

// Mock data generator
function generateMockData(dateRange: DateRange): DashboardData {
  const totalConversations = Math.floor(Math.random() * 1000) + 500;
  
  const subjects: SubjectStats[] = [
    { name: 'Technical Support', count: Math.floor(Math.random() * 300) + 200, percentage: 0 },
    { name: 'Billing Inquiries', count: Math.floor(Math.random() * 200) + 150, percentage: 0 },
    { name: 'Product Questions', count: Math.floor(Math.random() * 150) + 100, percentage: 0 },
  ];

  const branches: BranchStats[] = [
    { name: 'Main Street Branch', count: Math.floor(Math.random() * 250) + 150, percentage: 0 },
    { name: 'Downtown Branch', count: Math.floor(Math.random() * 200) + 100, percentage: 0 },
    { name: 'West Side Branch', count: Math.floor(Math.random() * 150) + 100, percentage: 0 },
    { name: 'East End Branch', count: Math.floor(Math.random() * 150) + 100, percentage: 0 },
  ];

  // Calculate percentages
  subjects.forEach(subject => {
    subject.percentage = Math.round((subject.count / totalConversations) * 100);
  });

  branches.forEach(branch => {
    branch.percentage = Math.round((branch.count / totalConversations) * 100);
  });

  return {
    totalConversations,
    topSubjects: subjects,
    topBranches: branches,
    dateRange,
    lastUpdated: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();

    if (!startDate || !endDate) {
      const response: DashboardResponse = {
        success: false,
        error: 'Start date and end date are required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Here you would typically:
    // 1. Validate the date range
    // 2. Query your database
    // 3. Process the data
    // For now, we'll return mock data
    const dateRange: DateRange = { startDate, endDate };
    const dashboardData = generateMockData(dateRange);

    const response: DashboardResponse = {
      success: true,
      data: dashboardData
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    const response: DashboardResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
