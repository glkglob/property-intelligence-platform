import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

function DealCopilot(): React.JSX.Element {
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <Layout title="Deal Copilot">
      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-sm text-slate-500">Property ID: {propertyId}</div>
          <form className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Expected sale price</span>
              <input className="rounded-xl border border-slate-300 px-3 py-2" type="number" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Rental income</span>
              <input className="rounded-xl border border-slate-300 px-3 py-2" type="number" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Refurb cost</span>
              <input className="rounded-xl border border-slate-300 px-3 py-2" type="number" />
            </label>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Placeholder analysis</div>
          <div className="mt-1 text-2xl font-bold">ROI: 0.00%</div>
        </section>
      </div>
    </Layout>
  );
}

export default DealCopilot;
