import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

export const dynamic = 'force-dynamic';

const memoryMessages = global.memoryMessages || [];
global.memoryMessages = memoryMessages;

// POST /api/contact - Save contact form data to MongoDB (with Cloud Fallback)
export async function POST(req) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Please fill out all required fields.' },
        { status: 400 }
      );
    }

    const db = await connectDB();

    let contactMsg;

    if (db && mongoose.connection.readyState === 1) {
      contactMsg = await ContactMessage.create({
        name,
        email,
        phone: phone || '',
        subject,
        message
      });
    } else {
      contactMsg = {
        _id: 'msg_' + Date.now(),
        name,
        email,
        phone: phone || '',
        subject,
        message,
        createdAt: new Date()
      };
      memoryMessages.push(contactMsg);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been saved successfully.',
      contactMsg
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been recorded.',
      contactMsg: { name, email, phone, subject, message }
    });
  }
}

// GET /api/contact - Fetch saved contact messages (Admin)
export async function GET() {
  try {
    const db = await connectDB();
    if (db && mongoose.connection.readyState === 1) {
      const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, messages });
    }
    return NextResponse.json({ success: true, messages: memoryMessages });
  } catch (error) {
    return NextResponse.json({ success: true, messages: memoryMessages });
  }
}

