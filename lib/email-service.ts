const BREVO_API_KEY = process.env.BREVO_API_KEY;
const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;
const MAILERSEND_API_KEY = process.env.MAILER_SEND_API_KEY;

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (BREVO_API_KEY) {
    await sendWithBrevo(payload);
    return;
  }

  if (POSTMARK_API_KEY) {
    await sendWithPostmark(payload);
    return;
  }

  if (MAILERSEND_API_KEY) {
    await sendWithMailerSend(payload);
    return;
  }

  throw new Error('No email provider is configured. Set BREVO_API_KEY, POSTMARK_API_KEY, or MAILER_SEND_API_KEY in .env.local');
}

async function sendWithBrevo({ to, subject, html, text }: EmailPayload) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY ?? '',
    },
    body: JSON.stringify({
      sender: { email: 'no-reply@niser.gov.ng', name: 'NISER' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo email send failed: ${response.status} ${body}`);
  }
}

async function sendWithPostmark({ to, subject, html, text }: EmailPayload) {
  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Postmark-Server-Token': POSTMARK_API_KEY ?? '',
    },
    body: JSON.stringify({
      From: 'no-reply@niser.gov.ng',
      To: to,
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Postmark send failed: ${response.status} ${body}`);
  }
}

async function sendWithMailerSend({ to, subject, html, text }: EmailPayload) {
  const response = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MAILERSEND_API_KEY ?? ''}`,
    },
    body: JSON.stringify({
      from: { email: 'no-reply@niser.gov.ng', name: 'NISER' },
      to: [{ email: to }],
      subject,
      html: html,
      text: text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`MailerSend send failed: ${response.status} ${body}`);
  }
}
