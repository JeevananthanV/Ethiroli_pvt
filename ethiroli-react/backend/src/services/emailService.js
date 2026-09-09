import pool from '../config/database.js';
import { logger } from '../config/logger.js';

let nodemailer = null;
let nodemailerAvailable = false;
try {
  nodemailer = await import('nodemailer');
  nodemailerAvailable = true;
} catch (error) {
  logger.warn('nodemailer package not available. Email sending will be disabled.', { error: error.message });
}

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
  const provider = process.env.EMAIL_PROVIDER || 'smtp';
  const dbConfig = await loadProviderConfig();

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

  if (provider === 'ses') {
    const region = dbConfig?.config?.region || process.env.AWS_REGION;
    if (!region) {
      logger.warn('AWS SES region not configured.');
      return null;
    }
    return nodemailer.createTransport({
      SES: new (require('aws-sdk')).SES({ region })
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
  const mailTransporter = await getTransporter();

  if (!mailTransporter) {
    logger.warn('Email transporter not configured. Email not sent.', { to, subject });
    return { success: false, message: 'Email provider not configured' };
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

    logger.info('Email sent', { to, subject, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send failed', { to, subject, error: error.message });
    return { success: false, error: error.message };
  }
};

export const sendFollowUpEmail = async (to, name, message) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Follow-up from Ethiroli</h2>
      <p>Hi ${name},</p>
      <p>${message}</p>
      <p>Best regards,<br>Ethiroli Team</p>
    </div>
  `;

  return sendEmail(to, 'Follow-up from Ethiroli', html, message);
};

export const sendWelcomeEmail = async (to, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Ethiroli!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining Ethiroli. We're excited to have you on board.</p>
      <p>Best regards,<br>Ethiroli Team</p>
    </div>
  `;

  return sendEmail(to, 'Welcome to Ethiroli', html);
};

export const sendPasswordReset = async (to, resetLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetLink}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail(to, 'Password Reset Request', html);
};

export const sendInvoice = async (to, invoice) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Invoice #${invoice.invoiceNumber || invoice.id}</h2>
      <p>Dear Customer,</p>
      <p>Please find your invoice attached.</p>
      <p><strong>Amount:</strong> ${invoice.amount || invoice.total_amount}</p>
      <p><strong>Due Date:</strong> ${invoice.due_date || invoice.dueDate}</p>
      <p>Best regards,<br>Ethiroli Team</p>
    </div>
  `;

  return sendEmail(to, `Invoice #${invoice.invoiceNumber || invoice.id}`, html);
};

export const sendNotification = async (to, subject, body) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${subject}</h2>
      <p>${body}</p>
      <p>Best regards,<br>Ethiroli Team</p>
    </div>
  `;

  return sendEmail(to, subject, html, body);
};
