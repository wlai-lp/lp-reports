import { NextResponse } from 'next/server';

// Mock data generator for conversation details
function generateMockConversationData(date: string) {
  const categories = [
    'Account Access',
    'Technical Support',
    'Billing',
    'Product Information',
    'Service Issues',
  ];

  const conversations = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, index) => {
    const timestamp = new Date(date);
    timestamp.setHours(Math.floor(Math.random() * 24));
    timestamp.setMinutes(Math.floor(Math.random() * 60));

    const statuses = ['contained', 'not_contained', 'escalated'] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `conv-${date}-${index}`,
      timestamp: timestamp.toISOString(),
      status,
      category: categories[Math.floor(Math.random() * categories.length)],
      duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes in seconds
      userMessages: Math.floor(Math.random() * 10) + 2,
      botMessages: Math.floor(Math.random() * 15) + 3,
    };
  });

  // Sort by timestamp
  conversations.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    date,
    conversations,
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
    const reportData = generateMockConversationData(date);

    return NextResponse.json({
      success: true,
      data: reportData
    });

  } catch (error) {
    console.error('Error generating conversation report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate conversation report' },
      { status: 500 }
    );
  }
}
