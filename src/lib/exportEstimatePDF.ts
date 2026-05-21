import { getSupabaseClient } from './supabaseClient';
import type { PdfRoom } from './generateEstimatePDF';

export interface ExportEstimateParams {
  description: string;
  total_cost: number;
  created_at: string;
  rooms: PdfRoom[];
}

export async function exportEstimatePDF(params: ExportEstimateParams): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const url = `${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/generate-estimate-pdf`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    },
    body: JSON.stringify({ estimate: params }),
  });

  if (!response.ok) {
    let message = 'PDF generation failed';
    try {
      const json = (await response.json()) as { error?: string };
      if (json.error) message = json.error;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = `Estimate_${params.description.replace(/[^a-z0-9]/gi, '_').slice(0, 40)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
}
