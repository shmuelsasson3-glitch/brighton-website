export const config = {
  path: '/api/contact-submit',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const body = await req.json().catch(() => null);
  if (!body) return json({ error: 'Invalid request body' }, 400);

  const { name, phone, email, propertyType, service, details } = body;

  if (!name || !phone || !email) {
    return json({ error: 'Name, phone, and email are required.' }, 400);
  }

  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'info@BrightonLawn.com';
  const from = process.env.RESEND_FROM_EMAIL || 'Brighton Lawn & Landscape <onboarding@resend.dev>';

  const html = `
    <h2>New Quote Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Property Type:</strong> ${escapeHtml(propertyType || 'Not specified')}</p>
    <p><strong>Service Needed:</strong> ${escapeHtml(service || 'Not specified')}</p>
    <p><strong>Project Details:</strong><br>${escapeHtml(details || 'None provided').replace(/\n/g, '<br>')}</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to: recipient,
      reply_to: email,
      subject: `New Quote Request - ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    return json({ error: errBody.message || 'Failed to send email' }, 502);
  }

  return json({ ok: true });
};
