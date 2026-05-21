import React from 'react';
import Layout from '../components/Layout';

function NewProperty(): React.JSX.Element {
  return (
    <Layout title="New Property">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-medium">Address</span>
            <input className="rounded-xl border border-slate-300 px-3 py-2" type="text" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Postcode</span>
            <input className="rounded-xl border border-slate-300 px-3 py-2" type="text" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Purchase price</span>
            <input className="rounded-xl border border-slate-300 px-3 py-2" type="number" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Bedrooms</span>
            <input className="rounded-xl border border-slate-300 px-3 py-2" type="number" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Bathrooms</span>
            <input className="rounded-xl border border-slate-300 px-3 py-2" type="number" />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-4 py-2 font-medium text-white"
            >
              Save property
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default NewProperty;
