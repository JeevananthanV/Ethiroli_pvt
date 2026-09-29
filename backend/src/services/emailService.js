import pool from '../config/database.js';
import { logger } from '../config/logger.js';
import { sendBrevoEmail, getDailyQuotaStatus, sendBrevoTestEmail } from './brevoService.js';

import nodemailer from 'nodemailer';
const nodemailerAvailable = true;

let transporter = null;

const loadProviderConfig = async () => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM provider_configs WHERE type = 'email' AND is_active = TRUE LIMIT 1"
    );
    if (rows.length > 0) {
      return rows[0];
    }
  } catch (error) {
    logger.warn('Failed to load email provider config from database', { error: error.message });
  }
  return null;
};

const createTransporter = async () => {
  const provider = (process.env.EMAIL_PROVIDER || 'brevo').toLowerCase();
  const dbConfig = await loadProviderConfig();

  if (provider === 'brevo' || process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY) {
    // Brevo is handled by brevoService
    return null;
  }

  if (provider === 'smtp') {
    const host = dbConfig?.config?.host || process.env.EMAIL_HOST;
    const port = Number(dbConfig?.config?.port || process.env.EMAIL_PORT || 587);
    const user = dbConfig?.config?.user || process.env.EMAIL_USER;
    const pass = dbConfig?.config?.pass || process.env.EMAIL_PASS;

    if (!host || !user || !pass) {
      logger.warn('SMTP credentials not fully configured.');
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  if (provider === 'sendgrid') {
    const apiKey = dbConfig?.config?.apiKey || process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      logger.warn('SendGrid API key not configured.');
      return null;
    }
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: { user: 'apikey', pass: apiKey }
    });
  }

  return null;
};

export const getTransporter = async () => {
  if (!transporter) {
    transporter = await createTransporter();
  }
  return transporter;
};

export const sendEmail = async (to, subject, html, text = null, from = null) => {
  const provider = (process.env.EMAIL_PROVIDER || 'brevo').toLowerCase();

  // If configured for Brevo (recommended ₹0-First default)
  if (provider === 'brevo' || process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY || !process.env.EMAIL_HOST) {
    return sendBrevoEmail({ to, subject, html, text });
  }

  const mailTransporter = await getTransporter();

  if (!mailTransporter) {
    // Fall back gracefully to Brevo service
    return sendBrevoEmail({ to, subject, html, text });
  }

  const fromAddress = from || process.env.EMAIL_FROM || 'Ethiroli <noreply@ethiroli.com>';

  try {
    const info = await mailTransporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html
    });

    logger.info('Email sent via SMTP', { to, subject, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send failed, trying Brevo fallback', { to, subject, error: error.message });
    return sendBrevoEmail({ to, subject, html, text });
  }
};

export const sendFollowUpEmail = async (to, name, message) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Follow-up from Ethiroli</h2>
      <p>Hi ${name},</p>
      <p>${message}</p>
      <p style="margin-top: 24px; color: #64748b;">Best regards,<br><strong>Ethiroli Team</strong></p>
    </div>
  `;

  return sendEmail(to, 'Follow-up from Ethiroli', html, message);
};

export const sendWelcomeEmail = async (to, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Welcome to Ethiroli!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining Ethiroli. We're excited to have you on board.</p>
      <p style="margin-top: 24px; color: #64748b;">Best regards,<br><strong>Ethiroli Team</strong></p>
    </div>
  `;

  return sendEmail(to, 'Welcome to Ethiroli', html);
};

export const sendPasswordReset = async (to, resetLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p style="margin: 20px 0;"><a href="${resetLink}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a></p>
      <p style="color: #64748b; font-size: 13px;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail(to, 'Password Reset Request', html);
};

export const sendInvoice = async (to, invoice) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Invoice #${invoice.invoiceNumber || invoice.id}</h2>
      <p>Dear Customer,</p>
      <p>Please find your invoice details below:</p>
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Amount:</strong> ₹${invoice.amount || invoice.total_amount}</p>
        <p style="margin: 4px 0;"><strong>Due Date:</strong> ${invoice.due_date || invoice.dueDate}</p>
      </div>
      <p style="margin-top: 24px; color: #64748b;">Best regards,<br><strong>Ethiroli Finance Team</strong></p>
    </div>
  `;

  return sendEmail(to, `Invoice #${invoice.invoiceNumber || invoice.id}`, html);
};

export const sendNotification = async (to, subject, body) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">${subject}</h2>
      <p>${body}</p>
      <p style="margin-top: 24px; color: #64748b;">Best regards,<br><strong>Ethiroli Team</strong></p>
    </div>
  `;

  return sendEmail(to, subject, html, body);
};

export { getDailyQuotaStatus, sendBrevoTestEmail };
