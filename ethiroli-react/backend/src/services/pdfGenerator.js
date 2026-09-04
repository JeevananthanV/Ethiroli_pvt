export const generatePayslipPDF = async (payrollRecord) => {
  console.log('[PDF Service Mock] Generating Payslip PDF...');
  return { success: true, pdfUrl: '/assets/payslips/mock-payslip.pdf' };
};
