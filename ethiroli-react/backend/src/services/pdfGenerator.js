import pdf from 'pdfkit';
import { logger } from '../config/logger.js';

export const generateInvoicePDF = async (invoice) => {
  logger.info('Generating invoice PDF', { invoiceId: invoice.id });

  try {
    const doc = new pdf({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));

    doc.fontSize(24).text('Invoice', { align: 'left' });
    doc.moveDown();
    doc.fontSize(14).text(`Invoice #: ${invoice.invoiceNumber || invoice.id}`);
    doc.text(`Date: ${invoice.issue_date || new Date().toISOString().split('T')[0]}`);
    doc.text(`Due Date: ${invoice.due_date || invoice.dueDate || 'N/A'}`);
    doc.moveDown();
    doc.text(`Amount: ${invoice.amount || invoice.total_amount || 0}`);
    doc.text(`Status: ${invoice.status || 'DRAFT'}`);

    doc.on('end', () => {
      logger.info('Invoice PDF generated', { bufferLength: Buffer.concat(chunks).length });
    });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve({ success: true, pdfBuffer: Buffer.concat(chunks) });
      });
      doc.on('error', reject);
    });
  } catch (error) {
    logger.error('Invoice PDF generation failed', { error: error.message });
    throw error;
  }
};

export const generatePayslipPDF = async (payroll) => {
  logger.info('Generating payslip PDF', { payrollId: payroll.id });

  try {
    const doc = new pdf({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));

    doc.fontSize(24).text('Payslip', { align: 'left' });
    doc.moveDown();
    doc.fontSize(14).text(`Employee: ${payroll.employee_name || payroll.employee_id}`);
    doc.text(`Period: ${payroll.pay_period_start || ''} to ${payroll.pay_period_end || ''}`);
    doc.moveDown();
    doc.text(`Basic Salary: ${payroll.basic_salary || 0}`);
    doc.text(`HRA: ${payroll.hra || 0}`);
    doc.text(`DA: ${payroll.da || 0}`);
    doc.text(`PF: ${payroll.pf || 0}`);
    doc.text(`ESI: ${payroll.esi || 0}`);
    doc.text(`TDS: ${payroll.tds || 0}`);
    doc.moveDown();
    doc.fontSize(16).text(`Net Salary: ${payroll.net_salary || 0}`);

    doc.on('end', () => {
      logger.info('Payslip PDF generated', { bufferLength: Buffer.concat(chunks).length });
    });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve({ success: true, pdfBuffer: Buffer.concat(chunks) });
      });
      doc.on('error', reject);
    });
  } catch (error) {
    logger.error('Payslip PDF generation failed', { error: error.message });
    throw error;
  }
};

export const generateReportPDF = async (report) => {
  logger.info('Generating report PDF', { reportType: report.type });

  try {
    const doc = new pdf({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));

    doc.fontSize(24).text(report.title || 'Report', { align: 'left' });
    doc.moveDown();
    doc.fontSize(14).text(`Generated: ${new Date().toISOString()}`);
    doc.moveDown();

    if (report.columns && report.rows) {
      for (const row of report.rows) {
        doc.text(row.join(' | '));
      }
    } else {
      doc.text('No data available for this report.');
    }

    doc.on('end', () => {
      logger.info('Report PDF generated', { bufferLength: Buffer.concat(chunks).length });
    });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve({ success: true, pdfBuffer: Buffer.concat(chunks) });
      });
      doc.on('error', reject);
    });
  } catch (error) {
    logger.error('Report PDF generation failed', { error: error.message });
    throw error;
  }
};
