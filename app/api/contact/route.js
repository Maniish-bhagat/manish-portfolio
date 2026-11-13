import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

// In-memory rate limiting map (IP -> array of timestamps)
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15-minute sliding window
  const maxRequests = 3; // Maximum 3 messages allowed per 15 minutes per IP

  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((time) => now - time < windowMs);

  if (recent.length >= maxRequests) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);

  // Periodic memory garbage collection
  if (rateLimitMap.size > 2000) {
    for (const [key, times] of rateLimitMap.entries()) {
      const valid = times.filter((t) => now - t < windowMs);
      if (valid.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, valid);
    }
  }

  return false;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, hp_website } = body;

    // 1. Honeypot Anti-Bot Filter: If the hidden input is filled, silently discard spam
    if (hp_website) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully.' },
        { status: 200 }
      );
    }

    // 2. Required fields check
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    // 3. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 4. Message length sanity check
    const trimmedMsg = message.trim();
    if (trimmedMsg.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a meaningful message of at least 10 characters.' },
        { status: 400 }
      );
    }
    if (trimmedMsg.length > 3000) {
      return NextResponse.json(
        { error: 'Message is too long (maximum 3,000 characters).' },
        { status: 400 }
      );
    }

    // 5. Rate Limiting by Client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait 15 minutes before sending another inquiry.' },
        { status: 429 }
      );
    }

    const result = await sendContactEmail({ name, email, subject, message: trimmedMsg });

    return NextResponse.json(
      { success: true, message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
