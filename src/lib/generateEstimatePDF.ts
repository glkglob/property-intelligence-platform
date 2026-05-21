import { jsPDF } from 'jspdf';

export interface PdfLineItem {
  name: string;
  category: string;
  quantity: number;
  unit_cost: number;
}

export interface PdfRoom {
  name: string;
  items: PdfLineItem[];
}

export interface EstimatePdfParams {
  description: string;
  totalCost: number;
  createdAt: Date;
  rooms: PdfRoom[];
}

export function generateEstimatePDF({
  description,
  totalCost,
  createdAt,
  rooms,
}: EstimatePdfParams): void {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageW, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Intelligence', pageW / 2, 14, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Refurbishment Estimate', pageW / 2, 24, { align: 'center' });

  // Meta
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(description, 20, 48);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(
    `Generated ${createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    20,
    56,
  );

  // Breakdown heading
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  let y = 72;
  doc.text('Breakdown', 20, y);
  doc.setDrawColor(200);
  doc.line(20, y + 3, pageW - 20, y + 3);
  y += 12;

  for (const room of rooms) {
    if (room.items.length === 0) continue;

    if (y > 255) {
      doc.addPage();
      y = 20;
    }

    // Room name
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text(room.name, 20, y);
    y += 7;

    const roomTotal = room.items.reduce((s, i) => s + i.quantity * i.unit_cost, 0);

    // Items
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60);

    for (const item of room.items) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const itemTotal = (item.quantity * item.unit_cost).toLocaleString();
      doc.text(`${item.name}`, 26, y);
      doc.text(
        `${item.quantity} × £${item.unit_cost.toLocaleString()} = £${itemTotal}`,
        pageW - 20,
        y,
        { align: 'right' },
      );
      y += 6;
    }

    // Room subtotal
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80);
    doc.text(`Room total: £${roomTotal.toLocaleString()}`, pageW - 20, y, { align: 'right' });
    y += 10;
  }

  // Grand total
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setDrawColor(16, 185, 129);
  doc.line(20, y, pageW - 20, y);
  y += 8;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Total estimate', 20, y);
  doc.text(`£${totalCost.toLocaleString()}`, pageW - 20, y, { align: 'right' });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      'Property Intelligence Platform — Confidential',
      pageW / 2,
      287,
      { align: 'center' },
    );
  }

  const safeName = description.replace(/[^a-z0-9]/gi, '_').slice(0, 40);
  doc.save(`Estimate_${safeName}.pdf`);
}
