import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

function PropertyDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout title="Property Detail">
      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Property ID</div>
          <div className="mt-1 text-lg font-bold">{id}</div>
          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            <div>Address: Demo property</div>
            <div>Postcode: EX8 1AA</div>
            <div>Purchase price: £250,000</div>
            <div>Bedrooms: 3</div>
            <div>Bathrooms: 2</div>
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          <Link to={`/estimate/${id}`} className="rounded-xl bg-slate-950 px-4 py-2 text-white">
            Run estimate
          </Link>
          <Link to={`/deal/${id}`} className="rounded-xl bg-slate-950 px-4 py-2 text-white">
            Deal Copilot
          </Link>
          <Link to={`/refurbiq/${id}`} className="rounded-xl bg-slate-950 px-4 py-2 text-white">
            Refurb IQ
          </Link>
        </section>
      </div>
    </Layout>
  );
}

export default PropertyDetail;
