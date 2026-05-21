import React, { useMemo, useState } from 'react';
import {
  calculateEstimate,
  type EstimateInputItem,
  type EstimateItemType,
} from '../lib/estimate';

const ITEM_OPTIONS: { label: string; value: EstimateItemType }[] = [
  { label: 'Kitchen renovation', value: 'kitchen_renovation' },
  { label: 'Bathroom renovation', value: 'bathroom_renovation' },
  { label: 'Rewiring', value: 'rewiring' },
  { label: 'New roof', value: 'new_roof' },
];

interface EstimateFormProps {
  propertyId?: string;
}

function EstimateForm({ propertyId }: EstimateFormProps): React.JSX.Element {
  const [selected, setSelected] = useState<Record<EstimateItemType, boolean>>({
    kitchen_renovation: false,
    bathroom_renovation: false,
    rewiring: false,
    new_roof: false,
  });

  const inputItems = useMemo<EstimateInputItem[]>(
    () =>
      Object.entries(selected)
        .filter(([, isChecked]) => isChecked)
        .map(([type]) => ({ type: type as EstimateItemType, quantity: 1 })),
    [selected],
  );

  const result = useMemo(() => calculateEstimate(inputItems), [inputItems]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-sm text-slate-500">
        Property ID: {propertyId ?? 'placeholder'}
      </div>

      <div className="grid gap-3">
        {ITEM_OPTIONS.map((item) => (
          <label
            key={item.value}
            className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
          >
            <span className="font-medium">{item.label}</span>
            <input
              type="checkbox"
              checked={selected[item.value]}
              onChange={(event) =>
                setSelected((current) => ({
                  ...current,
                  [item.value]: event.target.checked,
                }))
              }
            />
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="text-sm text-slate-500">Estimated total</div>
        <div className="mt-1 text-2xl font-bold">£{result.totalCost.toLocaleString()}</div>
      </div>
    </section>
  );
}

export default EstimateForm;
