import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PdfItem {
  name: string;
  category: string | null;
  quantity: number | null;
  unit_cost: number | null;
}

interface PdfRoom {
  name: string;
  items: PdfItem[];
}

interface EstimateInput {
  description: string;
  total_cost: number;
  created_at: string;
  rooms: PdfRoom[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json() as { estimate?: EstimateInput };
    const estimate = body.estimate;

    if (!estimate) {
      return new Response(JSON.stringify({ error: 'estimate is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const pdfDoc = await PDFDocument.create();
    const pageW = 595;
    const pageH = 842;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // currentPage and y are mutable so ensureSpace can reassign them
    let currentPage = pdfDoc.addPage([pageW, pageH]);
    let y = pageH - 50;

    function ensureSpace(needed: number): void {
      if (y - needed < 60) {
        currentPage = pdfDoc.addPage([pageW, pageH]);
        y = pageH - 50;
      }
    }

    // Header
    currentPage.drawRectangle({
      x: 0,
      y: pageH - 72,
      width: pageW,
      height: 72,
      color: rgb(0.06, 0.73, 0.51),
    });
    currentPage.drawText('Property Intelligence', {
      x: 40,
      y: pageH - 38,
      size: 20,
      font: bold,
      color: rgb(1, 1, 1),
    });
    currentPage.drawText('Refurbishment Estimate', {
      x: 40,
      y: pageH - 58,
      size: 12,
      font,
      color: rgb(1, 1, 1),
    });
    y = pageH - 100;

    // Meta
    currentPage.drawText(estimate.description, { x: 40, y, size: 14, font: bold });
    y -= 20;
    currentPage.drawText(
      `Generated ${new Date(estimate.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      { x: 40, y, size: 10, font, color: rgb(0.45, 0.45, 0.45) },
    );
    y -= 30;

    // Breakdown heading
    ensureSpace(20);
    currentPage.drawText('Breakdown', { x: 40, y, size: 13, font: bold });
    y -= 6;
    currentPage.drawLine({
      start: { x: 40, y },
      end: { x: pageW - 40, y },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
    y -= 16;

    for (const room of estimate.rooms) {
      if (room.items.length === 0) continue;

      ensureSpace(24);
      currentPage.drawText(room.name, { x: 40, y, size: 12, font: bold });
      y -= 14;

      let roomTotal = 0;
      for (const item of room.items) {
        const qty = item.quantity ?? 0;
        const cost = item.unit_cost ?? 0;
        const lineTotal = qty * cost;
        roomTotal += lineTotal;

        ensureSpace(14);
        currentPage.drawText(item.name, { x: 50, y, size: 10, font });
        currentPage.drawText(
          `${qty} × £${cost.toLocaleString('en-GB')} = £${lineTotal.toLocaleString('en-GB')}`,
          { x: pageW - 40, y, size: 10, font },
        );
        y -= 12;
      }

      ensureSpace(14);
      currentPage.drawText(`Room total: £${roomTotal.toLocaleString('en-GB')}`, {
        x: pageW - 40,
        y,
        size: 10,
        font: bold,
        color: rgb(0.3, 0.3, 0.3),
      });
      y -= 20;
    }

    // Grand total
    ensureSpace(40);
    y -= 10;
    currentPage.drawLine({
      start: { x: 40, y },
      end: { x: pageW - 40, y },
      thickness: 1,
      color: rgb(0.06, 0.73, 0.51),
    });
    y -= 18;
    currentPage.drawText('Total estimate', { x: 40, y, size: 14, font: bold });
    currentPage.drawText(`£${estimate.total_cost.toLocaleString('en-GB')}`, {
      x: pageW - 40,
      y,
      size: 14,
      font: bold,
      color: rgb(0.06, 0.73, 0.51),
    });

    // Footer on every page
    const pageCount = pdfDoc.getPageCount();
    for (let p = 0; p < pageCount; p++) {
      const pg = pdfDoc.getPage(p);
      pg.drawText('Property Intelligence Platform — Confidential', {
        x: 40,
        y: 28,
        size: 8,
        font,
        color: rgb(0.6, 0.6, 0.6),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const safeName = estimate.description.replace(/[^a-z0-9]/gi, '_').slice(0, 40);

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Estimate_${safeName}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'PDF generation failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
