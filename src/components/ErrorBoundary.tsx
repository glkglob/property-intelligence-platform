import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 text-center text-slate-100">
          <h1 className="text-2xl font-black tracking-tight">Something went wrong</h1>
          {this.state.error && (
            <p className="max-w-md rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-sm text-slate-400">
              {this.state.error.message}
            </p>
          )}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400"
            >
              Reload
            </button>
            <a
              href="/properties"
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white"
            >
              Go to properties
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
