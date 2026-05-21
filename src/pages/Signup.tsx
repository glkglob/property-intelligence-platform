import React from 'react';
import Layout from '../components/Layout';

function Signup(): React.JSX.Element {
  return (
    <Layout title="Signup">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Email</span>
            <input className="rounded-xl border border-slate-300 px-3 py-2" type="email" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Password</span>
            <input className="rounded-xl border border-slate-300 px-3 py-2" type="password" />
          </label>

          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-4 py-2 font-medium text-white"
          >
            Create account
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Signup;
