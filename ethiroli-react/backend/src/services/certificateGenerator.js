import pdf from 'pdfkit';
import crypto from 'crypto';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const generateCertificate = async (data) => {
  logger.info('Generating certificate', { studentName: data.studentName, courseName: data.courseName });

  try {
    const doc = new pdf({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      logger.info('Certificate generated', { bufferLength: buffer.length });
    });

    doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(24).text(data.studentName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`has successfully completed the course`, { align: 'center' });
    doc.fontSize(20).text(data.courseName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${data.completionDate || new Date().toISOString().split('T')[0]}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Certificate ID: ${data.certificateId || crypto.randomUUID?.() || Date.now()}`, { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve({
          success: true,
          pdfBuffer: Buffer.concat(chunks),
          certificateId: data.certificateId || Date.now().toString()
        });
      });
      doc.on('error', reject);
    });
  } catch (error) {
    logger.error('Certificate generation failed', { error: error.message });
    throw error;
  }
};

export const verifyCertificate = async (certificateId) => {
  logger.info('Verifying certificate', { certificateId });

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM certificates WHERE id = ? OR certificate_number = ?',
      [certificateId, certificateId]
    );

    if (rows.length === 0) {
      return { success: false, message: 'Certificate not found' };
    }

    return { success: true, certificate: rows[0] };
  } catch (error) {
    logger.error('Certificate verification failed', { certificateId, error: error.message });
    throw error;
  }
};
