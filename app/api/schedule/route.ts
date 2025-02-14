import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, date, time } = await req.json();

    // Configure your email transport here
    const transporter = nodemailer.createTransport({
      // Add your email service configuration
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Terminbestätigung: @kernelshark Autogramm-Session',
      html: `
        <h1>Terminbestätigung</h1>
        <p>Hallo ${name},</p>
        <p>dein Termin für die Autogramm-Session wurde bestätigt:</p>
        <ul>
          <li>Datum: ${new Date(date).toLocaleDateString('de-DE')}</li>
          <li>Uhrzeit: ${time}</li>
        </ul>
        <p>Wir freuen uns auf dich!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to schedule appointment' },
      { status: 500 }
    );
  }
}