import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export interface ContactNotificationPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class MailerService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    // Only initialize active transporter if user credentials are provided
    if (env.SMTP_USER && env.SMTP_PASS && env.SMTP_PASS !== 'mock_app_password') {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465, // true for 465, false for 587
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
  }

  /**
   * Dispatch an immediate email notification when a visitor submits the contact form.
   * Gracefully fails without blocking if SMTP is unconfigured or in test environment.
   */
  async sendContactNotification(payload: ContactNotificationPayload): Promise<boolean> {
    const { name, email, subject, message } = payload;

    if (!this.transporter) {
      console.log(`✉️ [Mail Simulated] To: ${env.ADMIN_EMAIL} | From: ${name} (${email}) | Subject: ${subject}`);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: env.ADMIN_EMAIL,
        replyTo: email,
        subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
        text: `New contact form inquiry received:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nReceived at: ${new Date().toISOString()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
            <h2 style="color: #e91010; margin-top: 0;">New Contact Form Message</h2>
            <p><strong>Sender:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
            <div style="background: #f9f9f9; padding: 14px; border-radius: 4px; white-space: pre-wrap;">${message}</div>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Sent from Ayush Parekh Portfolio Website.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('⚠️ Failed to dispatch contact email notification:', error);
      // Return false but do not crash the caller
      return false;
    }
  }
}

export const mailerService = new MailerService();

