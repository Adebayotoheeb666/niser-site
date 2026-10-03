import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      organization?: string;
      subject?: string;
      message?: string;
    };

    const { firstName = '', lastName = '', email = '', organization = '', subject = '', message = '' } = body;

    if (!firstName.trim() || !lastName.trim()) {
      return NextResponse.json({ error: 'Please provide your full name.' }, { status: 400 });
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }
    if (!subject.trim()) {
      return NextResponse.json({ error: 'Please choose a subject.' }, { status: 400 });
    }
    if (!message.trim() || message.trim().length < 20) {
      return NextResponse.json({ error: 'Please write a message of at least 20 characters.' }, { status: 400 });
    }

    const name = `${firstName.trim()} ${lastName.trim()}`;
    const sender = organization?.trim() ? `${name}, ${organization.trim()}` : name;

    try {
      await sendEmail({
        to: 'info@niser.gov.ng',
        subject: `[Website Contact] ${subject} — ${name}`,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto;">
            <h2 style="color: #006B3F; border-bottom: 3px solid #FFB81C; padding-bottom: 0.5rem;">New website enquiry</h2>
            <table style="border-collapse: collapse; margin: 1.5rem 0; width: 100%;">
              <tr><td style="padding: 0.4rem 0.75rem; background: #f3f4f6; font-weight: 600;">From</td><td style="padding: 0.4rem 0.75rem;">${name}</td></tr>
              <tr><td style="padding: 0.4rem 0.75rem; background: #f3f4f6; font-weight: 600;">Email</td><td style="padding: 0.4rem 0.75rem;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 0.4rem 0.75rem; background: #f3f4f6; font-weight: 600;">Organization</td><td style="padding: 0.4rem 0.75rem;">${organization?.trim() || '—'}</td></tr>
              <tr><td style="padding: 0.4rem 0.75rem; background: #f3f4f6; font-weight: 600;">Subject</td><td style="padding: 0.4rem 0.75rem;">${subject}</td></tr>
            </table>
            <h3 style="margin-bottom: 0.5rem;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.7;">${message.trim()}</p>
          </div>
        `,
        text: `New website enquiry\n\nFrom: ${sender}\nEmail: ${email}\nOrganization: ${organization?.trim() || '—'}\nSubject: ${subject}\n\nMessage:\n${message.trim()}`,
      });

      return NextResponse.json({ message: 'Thank you — your message has been sent. We will respond shortly.' });
    } catch (error) {
      console.error('[Contact API - send failed]:', error);
      return NextResponse.json(
        { error: 'We could not send your message right now. Please email info@niser.gov.ng directly.' },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}