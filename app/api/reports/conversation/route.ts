import { NextResponse } from 'next/server';

// Category and subcategory mapping
type CategoryMap = {
  [key: string]: string[];
}

const categoryMap: CategoryMap = {
  'Account Access': [
    'Login Issues',
    'Password Reset',
    'Account Security',
    'Profile Management',
  ],
  'Technical Support': [
    'Software Issues',
    'Hardware Problems',
    'Network Connectivity',
    'System Updates',
  ],
  'Billing': [
    'Payment Issues',
    'Invoice Questions',
    'Subscription Management',
    'Refund Requests',
  ],
  'Product Information': [
    'Product Features',
    'Pricing Details',
    'Compatibility',
    'Documentation',
  ],
  'Service Issues': [
    'Downtime',
    'Performance',
    'Service Interruption',
    'Error Reporting',
  ],
};

// Mock data generator for conversation details
function generateMockConversationData(date: string, category?: string, subcategory?: string) {
  const categories = Object.keys(categoryMap);
  
  let conversations = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, index) => {
    const timestamp = new Date(date);
    timestamp.setHours(Math.floor(Math.random() * 24));
    timestamp.setMinutes(Math.floor(Math.random() * 60));

    const statuses = ['contained', 'not_contained', 'escalated'] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const subcategories = categoryMap[selectedCategory];
    const selectedSubcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
    
    return {
      id: `conv-${date}-${index}`,
      timestamp: timestamp.toISOString(),
      status,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes in seconds
      userMessages: Math.floor(Math.random() * 10) + 2,
      botMessages: Math.floor(Math.random() * 15) + 3,
    };
  });

  // Apply filters if provided
  if (category) {
    conversations = conversations.filter(conv => conv.category === category);
    if (subcategory) {
      conversations = conversations.filter(conv => conv.subcategory === subcategory);
    }
  }

  // Sort by timestamp
  conversations.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    date,
    conversations,
    categories: Object.entries(categoryMap).map(([category, subcategories]) => ({
      name: category,
      subcategories,
    })),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, category, subcategory } = body;

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      );
    }

    // In a real application, you would fetch this data from your database
    const reportData = generateMockConversationData(date, category, subcategory);

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
