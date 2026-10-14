import { NextResponse } from 'next/server';
import connectDB, { isDbConnected } from '@/lib/db';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email } = await req.json().catch(() => ({}));

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = await connectDB();

    if (db && isDbConnected()) {
      const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });
      if (existing) {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed to Kick Home Care updates!'
        });
      }

      await NewsletterSubscriber.create({ email: cleanEmail });
      return NextResponse.json({
        success: true,
        message: 'Thank you for subscribing! You will receive exclusive discounts and cleaning guides.'
      });
    }

    // Graceful fallback if database is currently offline
    global.memoryNewsletter = global.memoryNewsletter || [];
    if (!global.memoryNewsletter.includes(cleanEmail)) {
      global.memoryNewsletter.push(cleanEmail);
    }

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
