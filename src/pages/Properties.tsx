import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Properties(): React.JSX.Element {
  return (
    <Layout title="Properties">
      <div className="mb-6">
        <Link
          to="/properties/new"
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white"
        >
          Add property
        </Link>
      </div>

      <div className="grid gap-4">
        <Link
          to="/properties/demo-property"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="text-lg font-bold">45 Blenheim Road</div>
          <div className="mt-1 text-sm text-slate-500">London • Demo record</div>
        </Link>
      </div>
    </Layout>
  );
}

export default Properties;
