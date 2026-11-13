import nodemailer from 'nodemailer';

export async function sendContactEmail({ name, email, subject, message }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'manishkumar13builds@gmail.com';

  // If SMTP credentials are not fully configured yet, log safely and return a mock success
  if (!host || !user || !pass) {
    console.log('[CONTACT FORM] SMTP credentials not set in environment variables (.env.local). Message details logged below:');
    console.log({
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      message
    });

    return {
      success: true,
      message: 'Message received! (Form logged locally in dev environment until SMTP is configured).'
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"${name}" <${user}>`,
    replyTo: email,
    to: receiver,
    subject: `[Portfolio Inquiry] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px;">New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #0ea5e9; margin-top: 15px; border-radius: 4px;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <hr style="margin-top: 25px; border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 12px; color: #64748b;">Sent via Manish Bhagat Portfolio Website Contact Form</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return { success: true, message: 'Message sent successfully.' };
}
