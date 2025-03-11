import { NextResponse } from "next/server";
import { sendEmails } from "@/lib/email";

// In a real app, store this in a database
let receivers: string[] = ['kushagragupta625@gmail.com'];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    receivers.push(email);
    
    // Send email to all receivers
    await sendEmails(receivers);
    
    return NextResponse.json({ 
      success: true,
      message: 'Email added and sent successfully',
    });
  } catch (error) {
    console.error('Error in /api/mail/add:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}