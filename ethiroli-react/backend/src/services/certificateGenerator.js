export const generateCompletionCertificate = async (studentName, courseName) => {
  console.log('Certificate Generator Mock: Creating cert for ' + studentName + ' on course ' + courseName);
  return { pdfUrl: '/assets/certs/mock-certificate.pdf', qrCodeUrl: '/assets/certs/qr-mock.png' };
};
