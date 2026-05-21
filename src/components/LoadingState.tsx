import React from 'react';

interface LoadingStateProps {
  label?: string;
}

function LoadingState({
  label = 'Loading...',
}: LoadingStateProps): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
      {label}
    </div>
  );
}

export default LoadingState;
