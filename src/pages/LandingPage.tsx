import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function LandingPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Property Intelligence Platform</p>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                Refurb Genius core
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 hover:border-emerald-300 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Join beta
            </Link>
          </div>
        </nav>

        <div className="flex flex-1 items-center py-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-200">
              Private beta scaffold
            </div>

            <h1 className="text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
              One platform for refurbishment intelligence, deal analysis, and cost planning.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Refurb Genius is the core app in a wider property-intelligence platform, with Deal
              Copilot for acquisition analysis and Refurb IQ for BOQ and contractor-ready outputs.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950"
              >
                Get early access <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
