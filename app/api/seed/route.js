import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedData';

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with authentic Kick Home Care products & categories!',
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
