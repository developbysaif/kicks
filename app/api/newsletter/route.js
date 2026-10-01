import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Please enter your email' },
        { status: 400 }
      );
    }

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to Kick Home Care updates!'
      });
    }

    await NewsletterSubscriber.create({ email });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You will receive exclusive discounts and cleaning guides.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
