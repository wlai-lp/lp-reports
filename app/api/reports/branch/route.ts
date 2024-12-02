import { NextResponse } from 'next/server';

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
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

interface BranchReportResponse {
  success: boolean;
  error?: string;
  data?: BranchReportData;
}

function generateMockData(branches: string[], startDate: string, endDate: string): BranchReportData {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate daily data points for each branch
  const trend: BranchDataPoint[] = [];
  let totalCount = 0;
  
  for (let i = 0; i < daysDiff; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Generate data for each branch
    branches.forEach(branch => {
      // Base count varies by branch type
      let baseCount = 30;
      if (branch.toLowerCase().includes('main')) {
        baseCount = 50;
      } else if (branch.toLowerCase().includes('downtown')) {
        baseCount = 40;
      }
      
      // Add some randomness
      const randomFactor = Math.random() * 20 - 10; // -10 to +10
      
      // Add weekly patterns
      const weekday = currentDate.getDay();
      const isWeekend = weekday === 0 || weekday === 6;
      const weekendFactor = isWeekend ? 0.7 : 1;
      
      // Calculate final count
      const count = Math.max(0, Math.round((baseCount + randomFactor) * weekendFactor));
      
      trend.push({
        date: dateStr,
        count,
        branch
      });
      
      totalCount += count;
    });
  }

  return {
    branches,
    totalCount,
    averagePerDay: Math.round(totalCount / (daysDiff * branches.length)),
    trend,
    dateRange: {
      startDate,
      endDate
    }
  };
}

export async function POST(request: Request) {
  try {
    const { branches, startDate, endDate } = await request.json();

    if (!branches?.length || !startDate || !endDate) {
      return NextResponse.json({
        success: false,
        error: 'Branches, start date, and end date are required'
      } as BranchReportResponse, { status: 400 });
    }

    const data = generateMockData(branches, startDate, endDate);

    return NextResponse.json({
      success: true,
      data
    } as BranchReportResponse);

  } catch (error) {
    console.error('Error generating branch report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate branch report'
    } as BranchReportResponse, { status: 500 });
  }
}
