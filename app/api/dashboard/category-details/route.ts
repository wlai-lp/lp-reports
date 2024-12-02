import { NextResponse } from 'next/server';

// Mock data generator for category details
function generateMockCategoryDetails(category: string) {
  // Define an interface for subCategories to include percentage
  interface SubCategory {
    name: string;
    count: number;
    percentage?: number;
  }

  // Generate random sub-categories
  const subCategories: SubCategory[] = [
    { name: `${category} - Type A`, count: Math.floor(Math.random() * 100) + 50 },
    { name: `${category} - Type B`, count: Math.floor(Math.random() * 80) + 40 },
    { name: `${category} - Type C`, count: Math.floor(Math.random() * 60) + 30 },
    { name: `${category} - Type D`, count: Math.floor(Math.random() * 40) + 20 },
    { name: `${category} - Type E`, count: Math.floor(Math.random() * 20) + 10 },
  ];

  // Calculate total and percentages
  const total = subCategories.reduce((sum, sub) => sum + sub.count, 0);
  subCategories.forEach(sub => {
    sub.percentage = Number(((sub.count / total) * 100).toFixed(1));
  });

  // Generate time distribution data (last 7 days)
  const timeDistribution = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 10,
    };
  }).reverse();

  return {
    subCategories,
    timeDistribution,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category } = body;

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      );
    }

    // In a real application, you would fetch this data from your database
    const categoryDetails = generateMockCategoryDetails(category);

    return NextResponse.json({
      success: true,
      data: categoryDetails,
    });
  } catch (error) {
    console.error('Error in category-details API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
