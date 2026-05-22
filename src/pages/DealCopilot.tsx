import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { trackEvent } from '../lib/analytics';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Deal, DealRecommendation } from '../types/deal';
import type { StoredEstimate } from '../types/estimate';
import type { Property } from '../types/property';

interface DealMetrics {
  purchasePrice: number;
  gdv: number;
  refurbCost: number;
  buyingCosts: number;
  totalInvestment: number;
  grossProfit: number;
  margin: number;
  score: number;
  recommendation: DealRecommendation;
}

function calcMetrics(purchasePrice: number, gdv: number, refurbCost: number): DealMetrics {
  const buyingCosts = Math.round(purchasePrice * 0.05);
  const totalInvestment = purchasePrice + refurbCost + buyingCosts;
  const grossProfit = gdv - totalInvestment;
  const margin = gdv > 0 ? (grossProfit / gdv) * 100 : 0;
  const score = Math.round(Math.min(100, Math.max(0, (margin / 25) * 100)));
  const recommendation: DealRecommendation =
    score >= 65 ? 'proceed' : score >= 35 ? 'review' : 'reject';
  return {
    purchasePrice,
    gdv,
    refurbCost,
    buyingCosts,
    totalInvestment,
    grossProfit,
    margin,
    score,
    recommendation,
  };
}

const fmt = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

const RECOMMENDATION_STYLES: Record<DealRecommendation, string> = {
  proceed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  review: 'border-amber-200 bg-amber-50 text-amber-700',
  reject: 'border-red-200 bg-red-50 text-red-700',
};

const RECOMMENDATION_LABELS: Record<DealRecommendation, string> = {
  proceed: 'Proceed',
  review: 'Review',
  reject: 'Reject',
};

interface ScoreBadgeProps {
  score: number;
  recommendation: DealRecommendation;
}

function ScoreBadge({ score, recommendation }: ScoreBadgeProps): React.JSX.Element {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border px-6 py-5 ${RECOMMENDATION_STYLES[recommendation]}`}
    >
      <span className="text-5xl font-black">{score}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-60">Deal score</p>
        <p className="text-xl font-bold">{RECOMMENDATION_LABELS[recommendation]}</p>
      </div>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  bold?: boolean;
  danger?: boolean;
}

function MetricRow({ label, value, bold, danger }: MetricRowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between py-1">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd
        className={`text-sm ${bold ? 'font-bold' : 'font-medium'} ${danger ? 'text-red-600' : 'text-slate-900'}`}
      >
        {value}
      </dd>
    </div>
  );
}

function DealCopilot(): React.JSX.Element {
  const { propertyId } = useParams<{ propertyId: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [estimate, setEstimate] = useState<StoredEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [purchasePriceStr, setPurchasePriceStr] = useState('');
  const [gdvStr, setGdvStr] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedDeal, setSavedDeal] = useState<Deal | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;

    async function fetchData(): Promise<void> {
      try {
        const supabase = getSupabaseClient();
        const [propResult, estResult] = await Promise.all([
          supabase.from('properties').select('*').eq('id', propertyId!).single(),
          supabase
            .from('estimates')
            .select('*')
            .eq('property_id', propertyId!)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        if (cancelled) return;

        if (propResult.error) {
          setFetchError(
            propResult.error.code === 'PGRST116' ? 'Property not found.' : propResult.error.message,
          );
          return;
        }

        setProperty(propResult.data);
        const est = estResult.data ?? null;
        setEstimate(est);
        if (est?.gdv) setGdvStr(String(est.gdv));
      } catch (err) {
        if (!cancelled)
          setFetchError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const purchasePrice = parseFloat(purchasePriceStr) || 0;
  const gdv = parseFloat(gdvStr) || 0;
  const refurbCost = Number(estimate?.total_cost ?? 0);
  const canCalculate = purchasePrice > 0 && gdv > 0 && refurbCost > 0;
  const metrics = canCalculate ? calcMetrics(purchasePrice, gdv, refurbCost) : null;

  async function handleSave(): Promise<void> {
    if (!metrics || !estimate || !propertyId) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      const { data, error } = await getSupabaseClient()
        .from('deals')
        .insert({
          property_id: propertyId,
          estimate_id: estimate.id,
          score: metrics.score,
          recommendation: metrics.recommendation,
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (error) {
        setSaveError(error.message);
        trackEvent('save_failed', { context: 'deal_copilot', message: error.message });
      } else {
        setSavedDeal(data);
        trackEvent('estimate_completed', {
          propertyId,
          score: metrics.score,
          recommendation: metrics.recommendation,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed.';
      setSaveError(message);
      trackEvent('save_failed', { context: 'deal_copilot', message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout title="Deal Copilot">
      <div className="mx-auto grid max-w-2xl gap-8">
        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading…
          </div>
        ) : fetchError ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {fetchError}
          </div>
        ) : !property ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Property not found.
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Analysing
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">{property.address}</p>
              <p className="text-sm text-slate-500">
                {property.postcode} · {property.bedrooms} bed · {property.type}
              </p>
            </div>

            {!estimate ? (
              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
                <p className="text-sm font-semibold text-amber-900">No estimate yet</p>
                <p className="mt-1 text-sm text-amber-700">
                  Create a refurb estimate first — Deal Copilot uses the refurb cost to score this
                  deal.
                </p>
                <Link
                  to={`/estimate/${propertyId}`}
                  className="mt-4 inline-block rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
                >
                  Create estimate
                </Link>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Refurb cost (from latest estimate)
                  </p>
                  <p className="mt-1 text-3xl font-black text-slate-900">
                    {fmt(refurbCost)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{estimate.description}</p>
                </div>

                <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-900">Deal inputs</h2>

                  <div className="grid gap-2">
                    <label
                      htmlFor="dc-purchase"
                      className="text-sm font-medium text-slate-700"
                    >
                      Purchase price
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        £
                      </span>
                      <input
                        id="dc-purchase"
                        type="number"
                        min="0"
                        value={purchasePriceStr}
                        onChange={(e) => setPurchasePriceStr(e.target.value)}
                        placeholder="e.g. 180000"
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="dc-gdv" className="text-sm font-medium text-slate-700">
                      GDV — expected sale price after refurb
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        £
                      </span>
                      <input
                        id="dc-gdv"
                        type="number"
                        min="0"
                        value={gdvStr}
                        onChange={(e) => setGdvStr(e.target.value)}
                        placeholder="e.g. 250000"
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                      />
                    </div>
                  </div>
                </div>

                {metrics && (
                  <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <ScoreBadge score={metrics.score} recommendation={metrics.recommendation} />

                    <dl className="divide-y divide-slate-100">
                      <MetricRow label="Purchase price" value={fmt(metrics.purchasePrice)} />
                      <MetricRow label="Buying costs (~5%)" value={fmt(metrics.buyingCosts)} />
                      <MetricRow label="Refurb cost" value={fmt(metrics.refurbCost)} />
                      <MetricRow
                        label="Total investment"
                        value={fmt(metrics.totalInvestment)}
                        bold
                      />
                      <MetricRow label="GDV" value={fmt(metrics.gdv)} />
                      <MetricRow
                        label="Gross profit"
                        value={fmt(metrics.grossProfit)}
                        bold
                        danger={metrics.grossProfit < 0}
                      />
                      <MetricRow
                        label="Gross margin"
                        value={pct(metrics.margin)}
                        bold
                        danger={metrics.margin < 0}
                      />
                    </dl>

                    <div className="grid gap-2">
                      <label htmlFor="dc-notes" className="text-sm font-medium text-slate-700">
                        Notes (optional)
                      </label>
                      <textarea
                        id="dc-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Deal notes, caveats, next steps…"
                        className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                      />
                    </div>

                    {savedDeal ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Deal analysis saved.
                      </div>
                    ) : (
                      <>
                        {saveError && (
                          <div
                            role="alert"
                            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                          >
                            {saveError}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                          {isSaving ? 'Saving…' : 'Save deal analysis'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {propertyId && (
          <Link to={`/properties/${propertyId}`} className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to property
          </Link>
        )}
      </div>
    </Layout>
  );
}

export default DealCopilot;
