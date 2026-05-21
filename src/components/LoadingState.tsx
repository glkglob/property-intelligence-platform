import React from 'react';

interface LoadingStateProps {
  label?: string;
}

function LoadingState({
  label = 'Loading...',
}: LoadingStateProps): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-sm text-slate-400">
      {label}
    </div>
  );
}

export default LoadingState;
