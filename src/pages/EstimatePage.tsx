import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import EstimateForm from '../components/EstimateForm';
import Layout from '../components/Layout';
import { trackEvent } from '../lib/analytics';

function EstimatePage(): React.JSX.Element {
  const { propertyId } = useParams<{ propertyId: string }>();

  useEffect(() => {
    trackEvent('estimate_started', { propertyId });
  }, [propertyId]);

  return (
    <Layout title="Refurb estimate">
      <div className="mx-auto max-w-2xl">
        {!propertyId ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            No property selected — cannot create an estimate.
          </div>
        ) : (
          <>
            <p className="mb-8 text-sm text-slate-500">
              Add rooms and line items to build a cost plan. Save when ready.
            </p>
            <EstimateForm propertyId={propertyId} />
            <div className="mt-8">
              <Link
                to={`/properties/${propertyId}`}
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                ← Back to property
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default EstimatePage;
