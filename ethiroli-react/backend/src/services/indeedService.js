import crypto from 'crypto';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';
import { encrypt } from '../config/encryption.js';
import { broadcastToRole } from './socketService.js';
import { sendToRole } from './fcmService.js';
import { dispatchN8nEvent } from './n8nService.js';
import { sendEmail } from './emailService.js';

/**
 * Generate XML Job Feed conforming to Indeed's Job Feed Specification (Free organic syndication)
 */
export const generateIndeedJobFeedXml = async () => {
  try {
    const [jobs] = await pool.execute(
      "SELECT * FROM jobs WHERE status = 'OPEN' OR status = 'DRAFT' ORDER BY created_at DESC"
    );

    const baseUrl = process.env.FRONTEND_ORIGIN?.split(',')[0] || 'http://localhost:3000';
    const now = new Date().toUTCString();

    let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
    xml += `<source>\n`;
    xml += `  <publisher>Ethiroli</publisher>\n`;
    xml += `  <publisherurl>${baseUrl}</publisherurl>\n`;
    xml += `  <lastBuildDate>${now}</lastBuildDate>\n`;

    for (const job of jobs) {
      const pubDate = job.posted_at ? new Date(job.posted_at).toUTCString() : now;
      const jobUrl = `${baseUrl}/careers#${job.id}`;
      const location = job.location || 'Chennai, Tamil Nadu, India';
      const cleanDesc = (job.description || 'Join our innovative team at Ethiroli. Apply now!')
        .replace(/]]>/g, ']]&gt;');

      xml += `  <job>\n`;
      xml += `    <title><![CDATA[${job.title}]]></title>\n`;
      xml += `    <date><![CDATA[${pubDate}]]></date>\n`;
      xml += `    <referencenumber><![CDATA[${job.id}]]></referencenumber>\n`;
      xml += `    <url><![CDATA[${jobUrl}]]></url>\n`;
      xml += `    <company><![CDATA[Ethiroli]]></company>\n`;
      xml += `    <city><![CDATA[Chennai]]></city>\n`;
      xml += `    <state><![CDATA[Tamil Nadu]]></state>\n`;
      xml += `    <country><![CDATA[IN]]></country>\n`;
      xml += `    <description><![CDATA[${cleanDesc}]]></description>\n`;
      xml += `    <salary><![CDATA[${job.salary_range || 'Competitive'}]]></salary>\n`;
      xml += `    <jobtype><![CDATA[fulltime]]></jobtype>\n`;
      xml += `  </job>\n`;
    }

    xml += `</source>\n`;
    return xml;
  } catch (error) {
    logger.error('Failed to generate Indeed XML job feed', { error: error.message });
    throw error;
  }
};

/**
 * Ingest candidate application received from Indeed Apply Webhook
 */
export const processIndeedApplication = async (payload = {}, headers = {}) => {
  logger.info('Processing Indeed candidate application webhook', { payloadKeys: Object.keys(payload) });

  const logId = crypto.randomUUID();

  // Handle standard Indeed Apply payload structures or test payloads
  const applicant = payload.applicant || payload.candidate || payload;
  const rawName = applicant.fullName || applicant.name || `${applicant.firstName || ''} ${applicant.lastName || ''}`.trim() || 'Indeed Applicant';
  const rawEmail = applicant.email || payload.email || `applicant_${Date.now()}@indeed.example.com`;
  const rawPhone = applicant.phoneNumber || applicant.phone || payload.phone || null;
  const resumeUrl = applicant.resumeUrl || applicant.resume?.fileUrl || payload.resume_url || payload.resumeUrl || null;
  const indeedCandidateId = applicant.id || applicant.applicantId || payload.indeed_candidate_id || `ind_${Date.now()}`;
  let jobId = payload.jobId || payload.job_id || applicant.jobId || null;

  try {
    // If no jobId passed, match first open job or fallback
    let jobTitle = 'Software Engineer';
    if (!jobId) {
      const [availableJobs] = await pool.execute(
        "SELECT id, title FROM jobs ORDER BY (status = 'OPEN') DESC, created_at DESC LIMIT 1"
      );
      if (availableJobs.length > 0) {
        jobId = availableJobs[0].id;
        jobTitle = availableJobs[0].title;
      } else {
        jobId = crypto.randomUUID();
        jobTitle = 'Full Stack Developer';
        await pool.execute(
          `INSERT INTO jobs (id, title, description, department, status)
           VALUES (?, ?, 'Full Stack Engineering Role', 'Engineering', 'OPEN')`,
          [jobId, jobTitle]
        );
      }
    } else {
      const [foundJobs] = await pool.execute('SELECT title FROM jobs WHERE id = ?', [jobId]);
      if (foundJobs.length > 0) jobTitle = foundJobs[0].title;
    }

    // 1. Insert into candidates table with encrypted PII
    const candidateId = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO candidates (id, job_id, name, email, phone, resume_url, source, indeed_candidate_id, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'INDEED', ?, 'NEW', ?)`,
      [
        candidateId,
        jobId,
        encrypt(rawName),
        encrypt(rawEmail),
        rawPhone ? encrypt(rawPhone) : null,
        resumeUrl,
        indeedCandidateId,
        `Ingested from Indeed Apply Webhook on ${new Date().toLocaleString()}`
      ]
    );

    // 2. Also record in career_applications so HR portal displays it immediately
    await pool.execute(
      `INSERT INTO career_applications (full_name, email, phone, role, portfolio_url, experience_level, message)
       VALUES (?, ?, ?, ?, ?, 'Indeed Applicant', ?)`,
      [
        rawName,
        rawEmail,
        rawPhone || 'N/A',
        jobTitle,
        resumeUrl || 'N/A',
        `Applied via Indeed for ${jobTitle} (Candidate ID: ${indeedCandidateId})`
      ]
    );

    // 3. Log incoming webhook
    await pool.execute(
      `INSERT INTO incoming_webhook_logs (id, source, event, payload, status)
       VALUES (?, 'INDEED', 'candidate.apply', ?, 'PROCESSED')`,
      [logId, JSON.stringify(payload)]
    );

    // 4. Dispatch real-time alerts
    // Socket.IO to HR role
    broadcastToRole('HR', 'candidate_applied', {
      id: candidateId,
      name: rawName,
      email: rawEmail,
      jobTitle,
      source: 'INDEED',
      createdAt: new Date().toISOString()
    });

    // FCM Push Notification to HR role
    sendToRole('HR', {
      title: '🎯 New Candidate from Indeed',
      body: `${rawName} just applied for ${jobTitle} via Indeed!`,
      url: '/app/hr',
      data: { candidateId, source: 'INDEED' }
    }).catch(err => logger.warn('FCM push to HR failed for Indeed candidate', { error: err.message }));

    // n8n Workflow Dispatch
    dispatchN8nEvent('candidate.created', {
      id: candidateId,
      name: rawName,
      email: rawEmail,
      phone: rawPhone,
      jobId,
      jobTitle,
      source: 'INDEED'
    }).catch(err => logger.warn('n8n event dispatch failed for Indeed candidate', { error: err.message }));

    // Brevo Transactional Email confirmation to applicant
    sendEmail(
      rawEmail,
      `Application Received: ${jobTitle} at Ethiroli`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4F46E5;">Thank You for Applying via Indeed!</h2>
        <p>Dear ${rawName},</p>
        <p>We have successfully received your application for the <strong>${jobTitle}</strong> position at Ethiroli.</p>
        <p>Our Human Resources team is currently reviewing your application. If your profile matches our requirements, we will reach out to schedule an initial interview.</p>
        <p style="margin-top: 24px; color: #64748b; font-size: 14px;">Best regards,<br><strong>Ethiroli HR & Talent Acquisition Team</strong></p>
      </div>
      `
    ).catch(err => logger.warn('Confirmation email dispatch failed', { error: err.message }));

    logger.info('Indeed candidate ingested successfully', { candidateId, rawName, jobTitle });

    return {
      success: true,
      candidateId,
      indeedCandidateId,
      jobTitle,
      applicantName: rawName
    };
  } catch (err) {
    logger.error('Failed to process Indeed candidate application', { error: err.message, logId });
    await pool.execute(
      `INSERT INTO incoming_webhook_logs (id, source, event, payload, status, error_message)
       VALUES (?, 'INDEED', 'candidate.apply', ?, 'FAILED', ?)`,
      [logId, JSON.stringify(payload), err.message]
    ).catch(() => {});
    throw err;
  }
};

/**
 * Legacy support for posting job to Indeed publisher API
 */
export const postJob = async (jobId) => {
  logger.info('Posting job to Indeed organic XML / publisher', { jobId });
  return { success: true, platform: 'indeed', jobId, message: 'Job included in Indeed XML feed' };
};

/**
 * Fetch candidates ingested from Indeed
 */
export const fetchApplications = async (jobId) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, job_id, resume_url, source, indeed_candidate_id, status, notes, created_at FROM candidates WHERE source = ?',
      ['INDEED']
    );
    return { success: true, count: rows.length, applications: rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
