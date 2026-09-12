import { jsPDF } from 'jspdf';

const ORANGE = [234, 109, 39];

export function invoiceDoc(inv) {
  const d = new jsPDF();
  d.setFillColor(...ORANGE); d.rect(0, 0, 210, 26, 'F');
  d.setTextColor(255, 255, 255); d.setFontSize(15); d.setFont(undefined, 'bold');
  d.text('Online Legal India', 14, 12);
  d.setFontSize(9); d.setFont(undefined, 'normal'); d.text('Tax Invoice', 14, 20);
  d.setTextColor(30, 30, 30); d.setFontSize(10);
  d.setFont(undefined, 'bold'); d.text(`Invoice No: ${inv.no}`, 14, 40);
  d.setFont(undefined, 'normal'); d.text(`Invoice Date: ${inv.date}`, 140, 40);
  d.text('Bill To:', 14, 52);
  d.setFont(undefined, 'bold'); d.text('Vamsee Krishna', 14, 58);
  d.setFont(undefined, 'normal');
  d.text('ABC Foods Private Limited', 14, 64); d.text('demo@email.com', 14, 70);
  d.text(`Service: ${inv.service}`, 14, 84); d.text(`OLI ID: ${inv.oliId}`, 14, 90);
  d.setDrawColor(220, 220, 220); d.line(14, 98, 196, 98);
  d.setFont(undefined, 'bold'); d.text('Description', 14, 106); d.text('Amount', 170, 106);
  d.setFont(undefined, 'normal'); d.text(inv.service, 14, 114); d.text(`Rs. ${inv.amount}`, 170, 114);
  d.line(14, 122, 196, 122);
  d.setFont(undefined, 'bold'); d.text('Total Payable', 120, 130); d.text(`Rs. ${inv.amount}`, 170, 130);
  d.setTextColor(22, 163, 74); d.text('Status: PAID', 14, 130);
  d.setTextColor(130, 130, 130); d.setFontSize(8); d.setFont(undefined, 'normal');
  d.text('This is a system-generated demo invoice issued by Online Legal India.', 14, 282);
  return d;
}

export function receiptDoc(r) {
  const d = new jsPDF();
  d.setFillColor(47, 52, 110); d.rect(0, 0, 210, 26, 'F');
  d.setTextColor(255, 255, 255); d.setFontSize(15); d.setFont(undefined, 'bold');
  d.text('Online Legal India', 14, 12);
  d.setFontSize(9); d.setFont(undefined, 'normal'); d.text('Government Fee Receipt', 14, 20);
  d.setTextColor(30, 30, 30); d.setFontSize(10);
  d.text(`Receipt Ref: ${r.ref}`, 14, 40); d.text(`Date: ${r.date}`, 140, 40);
  d.text('Paid By: Vamsee Krishna (ABC Foods Private Limited)', 14, 52);
  d.text(`Service: ${r.service}`, 14, 66); d.text(`OLI ID: ${r.oliId}`, 14, 72);
  d.setDrawColor(220, 220, 220); d.line(14, 80, 196, 80);
  d.setFont(undefined, 'bold'); d.text('Government Fee Paid', 14, 90); d.text(`Rs. ${r.fee}`, 170, 90);
  d.setTextColor(22, 163, 74); d.text('Status: PAID', 14, 100);
  d.setTextColor(130, 130, 130); d.setFontSize(8); d.setFont(undefined, 'normal');
  d.text('Government fee paid by you through/via Online Legal India. Separate from OLI invoices.', 14, 282);
  return d;
}

export function certificateDoc(svc) {
  const d = new jsPDF();
  d.setDrawColor(...ORANGE); d.setLineWidth(2); d.rect(12, 12, 186, 273);
  d.setDrawColor(47, 52, 110); d.setLineWidth(0.6); d.rect(16, 16, 178, 265);
  d.setTextColor(...ORANGE); d.setFontSize(22); d.setFont(undefined, 'bold');
  d.text('Online Legal India', 105, 42, { align: 'center' });
  d.setTextColor(47, 52, 110); d.setFontSize(16);
  d.text('Certificate of Registration', 105, 58, { align: 'center' });
  d.setFontSize(10); d.setFont(undefined, 'normal'); d.setTextColor(90, 90, 90);
  d.text('This is to certify that the following service has been successfully completed', 105, 74, { align: 'center' });
  d.setTextColor(30, 30, 30); d.setFontSize(14); d.setFont(undefined, 'bold');
  d.text(svc.name, 105, 92, { align: 'center' });
  if (svc.sub) { d.setFontSize(11); d.setFont(undefined, 'normal'); d.text(svc.sub, 105, 100, { align: 'center' }); }
  d.setFontSize(10);
  d.text('Customer: Vamsee Krishna - ABC Foods Private Limited', 105, 116, { align: 'center' });
  d.text(`OLI ID: ${svc.oliId}`, 105, 126, { align: 'center' });
  d.setFont(undefined, 'bold');
  d.text(`Certificate No: ${svc.cert ? svc.cert.no : '-'}`, 105, 140, { align: 'center' });
  d.setFont(undefined, 'normal');
  d.text(`Issued on: ${svc.cert ? svc.cert.issuedOn : '-'}`, 105, 150, { align: 'center' });
  d.setDrawColor(200, 200, 200); d.line(60, 250, 150, 250);
  d.setFontSize(9); d.text('Authorised Signatory - Online Legal India', 105, 256, { align: 'center' });
  return d;
}

export function genPdfDataUrl(title, lines) {
  const d = new jsPDF();
  d.setFillColor(...ORANGE); d.rect(0, 0, 210, 20, 'F');
  d.setTextColor(255, 255, 255); d.setFontSize(12); d.setFont(undefined, 'bold');
  d.text('Online Legal India - Customer Document', 14, 13);
  d.setTextColor(30, 30, 30); d.setFontSize(14); d.text(title, 14, 36);
  d.setFontSize(10); d.setFont(undefined, 'normal');
  (lines || []).forEach((l, i) => d.text(l, 14, 50 + i * 8));
  return d.output('datauristring');
}

export function genPngDataUrl(label) {
  const c = document.createElement('canvas');
  c.width = 640; c.height = 400;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 640, 400);
  g.addColorStop(0, '#2f346e'); g.addColorStop(1, '#4a4f8f');
  x.fillStyle = g; x.fillRect(0, 0, 640, 400);
  x.fillStyle = '#ea6d27'; x.fillRect(0, 340, 640, 60);
  x.fillStyle = '#ffffff'; x.font = 'bold 26px sans-serif'; x.textAlign = 'center';
  x.fillText(label.replace(/\.[^.]+$/, ''), 320, 190);
  x.font = '15px sans-serif'; x.fillStyle = '#ffd9bd';
  x.fillText('Online Legal India - Demo Document', 320, 222);
  x.fillStyle = '#ffffff'; x.font = 'bold 14px sans-serif';
  x.fillText('UPLOADED CUSTOMER DOCUMENT', 320, 368);
  return c.toDataURL('image/png');
}

export function saveDoc(doc, filename) { doc.save(filename); }
