import { NextResponse } from 'next/server';

// Mock data generator for daily report
function generateMockDailyData(date: string) {
  const totalConversations = Math.floor(Math.random() * 500) + 200; // Random between 200-700
  const containedByBot = Math.floor(Math.random() * (totalConversations * 0.8)); // Up to 80% contained
  const notContainedByBot = Math.floor(Math.random() * (totalConversations - containedByBot));
  const escalatedToAgent = totalConversations - containedByBot - notContainedByBot;

  return {
    date,
    totalConversations,
    containedByBot,
    notContainedByBot,
    escalatedToAgent
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
