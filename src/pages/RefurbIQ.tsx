import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

function RefurbIQ(): React.JSX.Element {
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <Layout title="Refurb IQ">
      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Property ID: {propertyId}</div>
          <div className="mt-4 text-lg font-bold">BOQ placeholder</div>
          <p className="mt-2 text-sm text-slate-600">
            This page will show estimate line items and export actions.
          </p>
        </section>
      </div>
    </Layout>
  );
}

export default RefurbIQ;
