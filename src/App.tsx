import { ArrowRight, BarChart3, Brain, Building2, CheckCircle2, FileText, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Refurb Genius core',
    text: 'The core refurbishment intelligence app for estimates, deterministic pricing, ROI analysis, and investor-ready reporting.',
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'Deal Copilot',
    text: 'Acquisition intelligence for deal scoring, investor underwriting, opportunity review, and deterministic acquisition decisions.',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Refurb IQ',
    text: 'Downstream BOQ, cost planning, specifications, and contractor-grade outputs built from Refurb Genius estimates.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Governed AI layer',
    text: 'AI assists with photos, summaries, redesign concepts, and recommendations while deterministic engines remain financially authoritative.',
  },
];

const workflows = [
  'Capture property photos, assumptions, and refurbishment context',
  'Generate deterministic refurbishment estimates in Refurb Genius',
  'Run Deal Copilot acquisition scoring and investor underwriting',
  'Extend estimates into Refurb IQ BOQ, specifications, and cost plans',
  'Export reports for investors, contractors, and project teams',
];

const reportsPreview = [
  {
    name: 'Valuation Report - Victorian Terrace.pdf',
    client: 'Northbridge Capital',
    date: '18 May 2026',
    metric: '£412k max purchase',
  },
  {
    name: 'Cost Plan - Duplex Conversion.pdf',
    client: 'Harbour Property Group',
    date: '14 May 2026',
    metric: '£86k refurb scope',
  },
  {
    name: 'Investor Summary - Rental Refresh.pdf',
    client: 'Internal Review',
    date: '10 May 2026',
    metric: '17.4% projected ROI',
  },
];

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_75%_25%,rgba(16,185,129,0.18),transparent_30%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">Property Intelligence Platform</p>
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Refurb Genius core</p>
              </div>
            </div>
            <a href="#platform" className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-300 hover:text-white sm:inline-flex">
              View platform
            </a>
          </nav>

          <div className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Refurb Genius + Deal Copilot + Refurb IQ
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
                One platform for refurbishment intelligence, deal analysis, and cost planning.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                Refurb Genius is the core app in a wider property-intelligence platform, with Deal Copilot for acquisition analysis and Refurb IQ for BOQ, cost planning, specifications, and contractor-grade outputs.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#workflow" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-emerald-400/30 active:translate-y-0">
                  Explore workflow <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a href="#trust" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 active:translate-y-0">
                  See trust model
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-[1.5rem] bg-slate-900/90 p-5">
                <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm text-slate-400">Platform modules</p>
                    <p className="text-2xl font-bold">Core + Copilot + IQ</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300">Controlled beta</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Refurb Genius', 'Core app'],
                    ['Deal Copilot', 'Acquisition'],
                    ['Refurb IQ', 'BOQ + cost plans'],
                    ['AI role', 'Advisory only'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm text-slate-400">{label}</p>
                      <p className="mt-1 text-xl font-bold">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
                  Refurb Genius remains the platform spine. Deal Copilot adds acquisition intelligence. Refurb IQ extends estimates into BOQ, cost-plan, specification, and contractor-grade outputs.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="bg-slate-50 px-6 py-24 text-slate-950 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.24em] text-emerald-700">Platform architecture</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Refurb Genius is the core app. Deal Copilot and Refurb IQ extend it.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-900/5">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-white px-6 py-24 text-slate-950 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-semibold uppercase tracking-[0.24em] text-sky-700">Product workflow</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">From refurbishment estimate to acquisition decision to contractor-grade outputs.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The system helps property teams move from messy opportunity data into refurbishment estimates, acquisition underwriting, BOQ workflows, and investor-ready reporting without losing deterministic financial control.
            </p>
          </div>
          <div className="space-y-4">
            {workflows.map((item, index) => (
              <div key={item} className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</div>
                <div>
                  <p className="font-bold">{item}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Designed for controlled operational use, with graceful fallbacks and clear responsibility boundaries.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-6 py-24 text-slate-950 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-semibold uppercase tracking-[0.24em] text-emerald-700">Refurb IQ</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Turn estimates into BOQ, cost plans, and contractor-ready scopes.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Refurb IQ is the downstream delivery layer fed by Refurb Genius estimates. It translates refurbishment intelligence into trade-by-trade cost plans, specification outputs, and practical contractor-grade documentation.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['BOQ generation', 'Trade-by-trade cost plans', 'Specification outputs', 'Contractor-ready scopes'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/60 hover:shadow-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <div className="mb-6 border-b border-white/10 pb-5">
                <p className="text-sm text-slate-400">Downstream workflow</p>
                <p className="mt-1 text-2xl font-bold">Estimate → BOQ → Specification</p>
              </div>
              <div className="space-y-4">
                {[
                  ['01', 'Start from Refurb Genius estimate', 'Use deterministic pricing and scope assumptions as the source input.'],
                  ['02', 'Break into trades and work packages', 'Structure works across rooms, trades, materials, finishes, and project stages.'],
                  ['03', 'Produce contractor-ready outputs', 'Generate BOQ-style views, specifications, and cost-plan summaries for delivery teams.'],
                ].map(([step, title, text]) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-black text-slate-950">{step}</div>
                    <div>
                      <p className="font-bold">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-slate-950 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.24em] text-emerald-700">Refurb IQ clarity</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Refurb IQ is property refurbishment intelligence — not device repair automation.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              This keeps the platform anchored to refurbishment estimates, BOQ workflows, specifications, and contractor outputs downstream from Refurb Genius.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-2xl font-black text-emerald-950">Refurb IQ is</h3>
              <div className="mt-5 space-y-3">
                {['BOQ generation', 'Trade-by-trade cost plans', 'Property refurbishment specifications', 'Contractor-ready scopes', 'Downstream from Refurb Genius estimates'].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm font-bold text-emerald-950 shadow-sm">
                    <span className="text-emerald-600">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6">
              <h3 className="text-2xl font-black text-rose-950">Refurb IQ is not</h3>
              <div className="mt-5 space-y-3">
                {['Hardware diagnostics', 'Device repair automation', 'Mobile phone refurbishment', 'Robotics repair workflow'].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm font-bold text-rose-950 shadow-sm">
                    <span className="text-rose-600">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-950 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="font-semibold uppercase tracking-[0.24em] text-emerald-300">Valuation dashboard</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Residual valuation with investor-ready PDF reports.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-400">
              A polished preview of live sensitivity modelling, deterministic valuation metrics, and professional export workflows available in the platform runtime.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 lg:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Live valuation engine</div>
                <h3 className="mt-2 text-2xl font-bold">45 Blenheim Road, London</h3>
              </div>
              <div className="sm:text-right">
                <div className="text-sm text-slate-500">Client</div>
                <div className="font-semibold">Alexandra Capital Partners</div>
              </div>
            </div>
            <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                ['GDV', '£475,000', false],
                ['Refurb Cost', '£92,000', false],
                ['Max Purchase Price', '£238,000', true],
                ['Projected Profit', '£95,000', true],
              ].map(([label, value, highlight]) => (
                <div key={label as string} className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${highlight ? 'border-emerald-400/30 bg-emerald-400/10 hover:border-emerald-300/60 hover:shadow-emerald-400/10' : 'border-white/10 bg-slate-900 hover:border-white/25'}`}>
                  <div className={`text-sm ${highlight ? 'text-emerald-300' : 'text-slate-500'}`}>{label}</div>
                  <div className={`mt-2 text-2xl font-bold sm:text-3xl ${highlight ? 'text-emerald-300' : 'text-white'}`}>{value}</div>
                </div>
              ))}
            </div>
            <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex h-80 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 p-6">
                <div className="text-center">
                  <div className="mb-3 text-4xl">📊</div>
                  <div className="font-semibold">Tornado Sensitivity Chart</div>
                  <div className="mt-1 text-sm text-slate-500">Impact on profit • Live modelling preview</div>
                </div>
              </div>
              <div className="flex h-80 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 p-6">
                <div className="text-center">
                  <div className="mb-3 text-4xl">📉</div>
                  <div className="font-semibold">Residual Waterfall</div>
                  <div className="mt-1 text-sm text-slate-500">GDV → costs → profit structure</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <button className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg hover:shadow-white/10 active:translate-y-0">
                📄 Export Professional PDF Report
                <span className="rounded bg-slate-300 px-2 py-0.5 text-xs font-bold text-slate-800 animate-pulse">Investor Ready</span>
              </button>
              <p className="max-w-2xl text-center text-sm leading-6 text-slate-500">
                Full interactive dashboard with live sliders, sensitivity modelling, confidential watermarking, and private report storage is available in the main platform runtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 text-slate-950 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">My Reports</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">Previous exports, ready to retrieve.</h2>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">Preview</span>
            </div>
            <div className="space-y-3">
              {reportsPreview.map((report) => (
                <div key={report.name} className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/60 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-950">{report.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{report.client} • {report.date}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Signed link</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">{report.metric}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-[0.24em] text-sky-700">Report library</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">A clean archive for generated valuation, cost-plan, and investor PDFs.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The main platform architecture supports report metadata, signed download links, client names, dates, and key financial snapshots so investors and project teams can quickly retrieve prior outputs.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Search by client or property', 'Signed private downloads', 'Report metadata snapshots', 'Recent export visibility'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="bg-slate-950 px-6 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-semibold uppercase tracking-[0.24em] text-emerald-300">Trust model</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Refurb Genius is the spine. AI assists. Engines decide.</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            The platform separates advisory AI from deterministic financial authority. Refurb Genius provides the core refurbishment analysis, Deal Copilot extends acquisition intelligence, and Refurb IQ turns estimates into practical cost-plan and specification outputs.
          </p>
          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            {['Canonical pricing and ROI engines', 'Validated AI output boundaries', 'Private report storage and signed access'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/[0.08]">
                <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-300" />
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
