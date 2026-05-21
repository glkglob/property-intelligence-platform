import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ComingSoonCard from '../components/ComingSoonCard';
import Layout from '../components/Layout';

function DealCopilot(): React.JSX.Element {
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <Layout title="Deal Copilot">
      <div className="mx-auto max-w-2xl">
        <ComingSoonCard featureName="Deal Copilot" />

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

export default DealCopilot;
