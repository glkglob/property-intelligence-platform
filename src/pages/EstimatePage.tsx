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
        <p className="mb-8 text-sm text-slate-500">
          Select refurbishment works to generate an instant cost estimate. Costs are calculated
          using fixed unit rates. Save the estimate to your account to revisit it later.
        </p>

        <EstimateForm propertyId={propertyId} />

        {propertyId && (
          <div className="mt-8">
            <Link
              to={`/properties/${propertyId}`}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              ← Back to property
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EstimatePage;
