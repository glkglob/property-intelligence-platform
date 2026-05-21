import React, { useMemo, useState } from 'react';
import {
  calculateEstimate,
  ESTIMATE_CATALOG,
  type EstimateItemCode,
  type EstimateInputItem,
} from '../lib/estimate';
import { saveEstimate } from '../lib/estimateService';

const ITEM_OPTIONS = (
  Object.entries(ESTIMATE_CATALOG) as [EstimateItemCode, { label: string; unitCost: number }][]
).map(([code, { label, unitCost }]) => ({ code, label, unitCost }));

interface EstimateFormProps {
  propertyId?: string;
}

function EstimateForm({ propertyId }: EstimateFormProps): React.JSX.Element {
  const [selected, setSelected] = useState<Record<EstimateItemCode, boolean>>({
    kitchen_renovation: false,
    bathroom_renovation: false,
    rewiring: false,
    new_roof: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<
    { type: 'success'; id: string } | { type: 'error'; message: string } | null
  >(null);

  const inputItems = useMemo<EstimateInputItem[]>(
    () =>
      Object.entries(selected)
        .filter(([, isChecked]) => isChecked)
        .map(([code]) => ({ code: code as EstimateItemCode, quantity: 1 })),
    [selected],
  );

  const result = useMemo(() => calculateEstimate(inputItems), [inputItems]);
  const hasItems = result.items.length > 0;

  async function handleSave(): Promise<void> {
    if (!propertyId) {
      setSaveResult({ type: 'error', message: 'No property selected — cannot save.' });
      return;
    }
    if (!hasItems) return;

    setIsSaving(true);
    setSaveResult(null);

    const outcome = await saveEstimate({ propertyId, result });

    if (outcome.error) {
      setSaveResult({ type: 'error', message: outcome.error });
    } else {
      setSaveResult({ type: 'success', id: outcome.savedId! });
    }
    setIsSaving(false);
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-slate-900">Select works</h2>
        <p className="mb-5 text-sm text-slate-500">
          Choose the refurbishment items to include in this estimate.
        </p>

        <div className="grid gap-3">
          {ITEM_OPTIONS.map((item) => (
            <label
              key={item.code}
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-4 hover:border-slate-300"
            >
              <div>
                <span className="font-medium text-slate-900">{item.label}</span>
                <span className="ml-3 text-sm text-slate-400">
                  £{item.unitCost.toLocaleString()}
                </span>
              </div>
              <input
                type="checkbox"
                checked={selected[item.code]}
                onChange={(e) =>
                  setSelected((prev) => ({ ...prev, [item.code]: e.target.checked }))
                }
                className="h-4 w-4 accent-slate-950"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Estimate</h2>

        {!hasItems ? (
          <p className="text-sm text-slate-400">
            Select at least one item above to see an estimate.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-slate-100">
              {result.items.map((item) => (
                <li key={item.code} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-medium text-slate-900">
                    £{item.totalCost.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-sm font-semibold text-slate-700">Total</span>
              <span className="text-2xl font-black text-slate-900">
                £{result.totalCost.toLocaleString()}
              </span>
            </div>
          </>
        )}

        {saveResult?.type === 'success' && (
          <p
            role="status"
            className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            Estimate saved successfully.
          </p>
        )}

        {saveResult?.type === 'error' && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {saveResult.message}
          </p>
        )}

        <button
          type="button"
          disabled={!hasItems || isSaving}
          onClick={handleSave}
          className="mt-5 rounded-xl bg-slate-950 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-40"
        >
          {isSaving ? 'Saving…' : 'Save estimate'}
        </button>
      </div>
    </section>
  );
}

export default EstimateForm;
