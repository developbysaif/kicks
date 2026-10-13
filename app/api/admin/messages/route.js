import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { getAuthUser } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

const DEFAULT_MESSAGES = [
  {
    _id: 'm1',
    name: 'Usman Ali',
    email: 'usman@gmail.com',
    phone: '+923001234567',
    subject: 'Inquiry about Kick Whito stock',
    message: 'Hello, I want to know if Kick Whito sneaker cleaner is available for bulk order in Lahore?',
    createdAt: new Date().toISOString()
  }
];

function getMemoryMessages() {
  if (!global.memoryMessages || !Array.isArray(global.memoryMessages) || global.memoryMessages.length === 0) {
    global.memoryMessages = [...DEFAULT_MESSAGES];
  }
  return global.memoryMessages;
}

export async function GET(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    if (db && mongoose.connection.readyState === 1) {
      const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
      return NextResponse.json({
        success: true,
        count: messages.length,
        messages
      });
    }

    const memMsgs = getMemoryMessages();
    return NextResponse.json({
      success: true,
      count: memMsgs.length,
      messages: memMsgs
    });
  } catch (error) {
    console.error('Admin messages GET error:', error);
    return NextResponse.json({ success: true, count: 0, messages: getMemoryMessages() });
  }
}

export async function DELETE(req) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Message ID is required' }, { status: 400 });
    }

    if (db && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await ContactMessage.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Message deleted successfully' });
    }

    global.memoryMessages = (global.memoryMessages || []).filter(m => m._id !== id);
    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
