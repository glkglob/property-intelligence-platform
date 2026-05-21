import React from 'react';
import { useParams } from 'react-router-dom';
import EstimateForm from '../components/EstimateForm';
import Layout from '../components/Layout';

function EstimatePage(): React.JSX.Element {
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <Layout title="Refurb Genius Estimate">
      <EstimateForm propertyId={propertyId} />
    </Layout>
  );
}

export default EstimatePage;
