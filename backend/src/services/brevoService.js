import nodemailer from 'nodemailer';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';

const DAILY_LIMIT = 300;
let smtpTransporter = null;

/**
 * Check today's quota and increment if within the 300/day limit
 */
export const checkAndIncrementQuota = async () => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const [rows] = await pool.execute(
      'SELECT emails_sent, max_limit FROM email_daily_quota WHERE quota_date = ?',
      [today]
    );

    if (rows.length === 0) {
      await pool.execute(
        'INSERT INTO email_daily_quota (quota_date, emails_sent, max_limit) VALUES (?, 1, ?)',
        [today, DAILY_LIMIT]
      );
      return { allowed: true, sentToday: 1, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - 1 };
    }

    const currentSent = rows[0].emails_sent;
    const maxLimit = rows[0].max_limit || DAILY_LIMIT;

    if (currentSent >= maxLimit) {
      logger.warn('Brevo daily email limit reached (300/day). Dispatches paused to preserve free tier.', {
        sent: currentSent,
        limit: maxLimit
      });
      return { allowed: false, sentToday: currentSent, limit: maxLimit, remaining: 0 };
    }

    if (currentSent >= maxLimit * 0.9) {
      logger.warn('Brevo daily email quota at 90% capacity.', { sent: currentSent, limit: maxLimit });
    }

    await pool.execute(
      'UPDATE email_daily_quota SET emails_sent = emails_sent + 1 WHERE quota_date = ?',
      [today]
    );

    return {
      allowed: true,
      sentToday: currentSent + 1,
      limit: maxLimit,
      remaining: maxLimit - (currentSent + 1)
    };
  } catch (error) {
    logger.warn('Quota check fallback (allowing dispatch):', { error: error.message });
    return { allowed: true, sentToday: 1, limit: DAILY_LIMIT, remaining: DAILY_LIMIT };
  }
};

/**
 * Get current daily quota status for Admin Dashboard
 */
export const getDailyQuotaStatus = async () => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const [rows] = await pool.execute(
      'SELECT emails_sent, max_limit, updated_at FROM email_daily_quota WHERE quota_date = ?',
      [today]
    );

    const sent = rows.length > 0 ? rows[0].emails_sent : 0;
    const limit = rows.length > 0 ? rows[0].max_limit : DAILY_LIMIT;

    return {
      date: today,
      sent,
      limit,
      remaining: Math.max(0, limit - sent),
      percentage: Math.min(100, Math.round((sent / limit) * 100)),
      isConfigured: Boolean(process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY || process.env.EMAIL_PASS)
    };
  } catch (err) {
    return {
      date: today,
      sent: 0,
      limit: DAILY_LIMIT,
      remaining: DAILY_LIMIT,
      percentage: 0,
      isConfigured: false
    };
  }
};

/**
 * Initialize or get Nodemailer SMTP transporter for Brevo
 */
const getSmtpTransporter = () => {
  if (smtpTransporter) return smtpTransporter;

  const host = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const user = process.env.BREVO_SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.BREVO_SMTP_KEY || process.env.EMAIL_PASS;

  if (!user || !pass) {
    logger.info('Brevo SMTP credentials not provided, running in simulated mode.');
    return null;
  }

  smtpTransporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // port 587 uses STARTTLS
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  return smtpTransporter;
};

/**
 * Dispatch transactional email via Brevo REST API (fallback if SMTP port 587 is blocked)
 */
const sendViaRestApi = async ({ to, subject, html, text, fromName, fromEmail }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY not configured for REST API dispatch');
  }

  const payload = {
    sender: {
      name: fromName || process.env.BREVO_FROM_NAME || 'Ethiroli SaaS',
      email: fromEmail || process.env.BREVO_FROM_EMAIL || 'noreply@ethiroli.com'
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text || html.replace(/<[^>]*>/g, '')
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo REST API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return { success: true, messageId: data.messageId, provider: 'brevo_rest' };
};

/**
 * Primary dispatch function with 300/day quota check, SMTP dispatch, and REST fallback
 */
export const sendBrevoEmail = async ({ to, subject, html, text = null, fromName = null, fromEmail = null }) => {
  logger.info('Initiating email dispatch via Brevo service', { to, subject });

  // 1. Quota Guardian Check
  const quota = await checkAndIncrementQuota();
  if (!quota.allowed) {
    return {
      success: false,
      reason: 'daily_quota_exceeded',
      message: 'Brevo free tier daily limit of 300 emails reached. Try again tomorrow or upgrade.'
    };
  }

  const senderName = fromName || process.env.BREVO_FROM_NAME || 'Ethiroli SaaS';
  const senderEmail = fromEmail || process.env.BREVO_FROM_EMAIL || 'noreply@ethiroli.com';
  const fromAddress = `"${senderName}" <${senderEmail}>`;

  // 2. Try SMTP Transport
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: text || html.replace(/<[^>]*>/g, ''),
        html
      });
      logger.info('Email delivered via Brevo SMTP relay', { messageId: info.messageId, to });
      return { success: true, messageId: info.messageId, provider: 'brevo_smtp', remainingToday: quota.remaining };
    } catch (smtpErr) {
      logger.warn('Brevo SMTP dispatch failed, attempting REST API fallback...', { error: smtpErr.message });
    }
  }

  // 3. Try REST API Fallback
  if (process.env.BREVO_API_KEY) {
    try {
      const restResult = await sendViaRestApi({ to, subject, html, text, fromName: senderName, fromEmail: senderEmail });
      return { ...restResult, remainingToday: quota.remaining };
    } catch (restErr) {
      logger.error('Brevo REST API fallback also failed', { error: restErr.message });
      return { success: false, error: restErr.message };
    }
  }

  // 4. Safe Simulation Fallback (in development if keys are unset)
  logger.info('[Brevo Simulated Dispatch] Email sent to recipient', { to, subject, remainingToday: quota.remaining });
  return {
    success: true,
    simulated: true,
    messageId: `sim_${Date.now()}`,
    remainingToday: quota.remaining
  };
};

/**
 * Send test email to verify Brevo configuration
 */
export const sendBrevoTestEmail = async (targetEmail) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4F46E5; margin-top: 0;">🚀 Brevo Integration Test Successful!</h2>
      <p>Congratulations! Your Brevo transactional email integration is operational on Ethiroli SaaS.</p>
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Relay Host:</strong> smtp-relay.brevo.com:587</p>
        <p style="margin: 4px 0;"><strong>Plan:</strong> ₹0-First Free Tier</p>
        <p style="margin: 4px 0;"><strong>Daily Limit:</strong> 300 emails/day</p>
        <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p style="color: #64748b; font-size: 13px;">This email was dispatched automatically from the Ethiroli Integration Dashboard.</p>
    </div>
  `;

  return sendBrevoEmail({
    to: targetEmail,
    subject: '🧪 Ethiroli - Brevo Email Integration Test',
    html
  });
};
