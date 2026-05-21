import { trackEvent } from './analytics';
import type { EstimateResult } from './estimate';
import { getSupabaseClient } from './supabaseClient';

export interface SaveEstimateParams {
  propertyId: string;
  result: EstimateResult;
}

export interface SaveEstimateOutcome {
  savedId: string | null;
  error: string | null;
}

export async function saveEstimate({
  propertyId,
  result,
}: SaveEstimateParams): Promise<SaveEstimateOutcome> {
  try {
    const description = result.items
      .map((i) => `${i.label} ×${i.quantity}`)
      .join('; ');

    const { data, error } = await getSupabaseClient()
      .from('estimates')
      .insert({
        property_id: propertyId,
        description,
        refurb_budget: result.totalCost,
        total_cost: result.totalCost,
        gdv: null,
        max_purchase_price: null,
        projected_profit: null,
      })
      .select('id')
      .single();

    if (error) {
      trackEvent('save_failed', { context: 'estimate', message: error.message });
      return { savedId: null, error: error.message };
    }

    trackEvent('estimate_completed', { propertyId, estimateId: data.id, total: result.totalCost });
    return { savedId: data.id, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed.';
    trackEvent('save_failed', { context: 'estimate', message });
    return { savedId: null, error: message };
  }
}
