import { ArrowRight, BarChart3, Brain, Building2, CheckCircle2, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Refurb Genius',
    text: 'Core refurbishment intelligence with deterministic pricing, ROI analysis, and investor-ready reporting.',
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'Deal Copilot',
    text: 'Acquisition intelligence for deal scoring, underwriting, and confident investment decisions.',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Refurb IQ',
    text: 'BOQ, cost planning, specifications, and contractor-grade outputs from your estimates.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Governed AI',
    text: 'AI assists with photos, summaries and recommendations — while deterministic engines stay in control.',
  },
];

const workflows = [
  'Upload property photos and refurbishment context',
  'Generate accurate refurbishment estimates in Refurb Genius',
  'Run Deal Copilot for acquisition scoring and underwriting',
  'Extend into Refurb IQ for BOQ, specifications & cost plans',
  'Export professional investor and contractor reports',
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.15),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pt-8 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight">Property Intelligence</p>
                <p className="text-xs text-emerald-300">Refurb Genius • Deal Copilot • Refurb IQ</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden text-sm text-slate-300 hover:text-white md:block">Sign in</Link>
              <Link
                to="/signup"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Join Beta
              </Link>
            </div>
          </nav>

          <div className="flex min-h-[85vh] flex-col items-center justify-center text-center pt-12 pb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm text-emerald-300 mb-6">
              <Sparkles className="h-4 w-4" /> Controlled Beta — Now Open
            </div>

            <h1 className="max-w-5xl text-6xl font-black leading-none tracking-tighter sm:text-7xl lg:text-[88px]">
              The AI Co-Pilot<br />for UK Property Investors
            </h1>

            <p className="mt-6 max-w-2xl text-xl text-slate-300">
              One platform for refurbishment intelligence, deal analysis, and contractor-ready cost planning.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-8 py-4 text-lg font-semibold text-slate-950 transition-all hover:bg-emerald-300 hover:shadow-xl hover:shadow-emerald-500/25"
              >
                Request Beta Access
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>

              <a
                href="#platform"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/5"
              >
                Explore the Platform
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="platform" className="bg-slate-900 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-emerald-400 font-semibold tracking-[3px] text-sm">THREE POWERFUL MODULES</p>
            <h2 className="mt-4 text-5xl font-black tracking-tight">One platform.<br />Three intelligent layers.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="group rounded-3xl border border-white/10 bg-slate-950 p-8 transition-all hover:border-emerald-400/50 hover:-translate-y-1">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="px-6 py-24 lg:px-8 bg-slate-950">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-emerald-400 font-semibold tracking-[3px] text-sm">HOW IT WORKS</p>
            <h2 className="mt-4 text-5xl font-black tracking-tight">From photo to profitable decision</h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {workflows.map((step, index) => (
              <div key={index} className="flex gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-emerald-400/40 transition-all">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-xl font-black text-slate-950">
                  {index + 1}
                </div>
                <div className="pt-1">
                  <p className="text-xl font-semibold">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BETA CTA */}
      <section id="beta" className="bg-emerald-400 px-6 py-24 text-slate-950 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-6xl font-black tracking-tight">Ready to transform how you invest in property?</h2>
          <p className="mt-6 text-xl">Join the controlled beta and get early access to the full platform.</p>

          <div className="mt-10">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-12 py-5 text-xl font-semibold text-white hover:bg-black transition-all active:scale-[0.985]"
            >
              Request Beta Access
            </Link>
            <p className="mt-4 text-sm text-emerald-800">Limited spots available • UK investors only</p>
          </div>
        </div>
      </section>

      {/* TRUST MODEL */}
      <section className="px-6 py-24 lg:px-8 bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-emerald-400 font-semibold tracking-[3px] text-sm">TRUST & GOVERNANCE</p>
          <h2 className="mt-4 text-5xl font-black tracking-tight">Refurb Genius is the spine.<br />AI assists. Engines decide.</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              "Deterministic pricing & ROI engines",
              "Clear AI boundaries (advisory only)",
              "Private reports with signed access"
            ].map((text, i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-6" />
                <p className="font-semibold">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
