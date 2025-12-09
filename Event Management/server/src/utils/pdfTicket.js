const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

async function generateTicketPDF(registration, event, user) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});
  doc.fontSize(20).text(event.title || 'Event', { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Name: ${user.name || user.email}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Ticket ID: ${registration.ticketId}`);
  doc.text(`Date: ${event.date ? new Date(event.date).toDateString() : 'TBA'} ${event.time || ''}`);
  doc.text(`Venue: ${event.location || 'TBA'}`).moveDown();
  const qrData = JSON.stringify({ ticketId: registration.ticketId });
  const qrImageDataUrl = await QRCode.toDataURL(qrData, { margin: 1 });
  const qrImageBase64 = qrImageDataUrl.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(qrImageBase64, 'base64');
  doc.image(qrBuffer, { fit: [150,150], align: 'center' }).moveDown();
  doc.fontSize(10).text('Present this QR at entry. Ticket will be validated.', { align: 'center' });
  doc.end();
  return await new Promise(resolve => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

module.exports = { generateTicketPDF };
