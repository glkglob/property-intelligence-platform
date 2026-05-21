import React from 'react';

interface EmptyStateProps {
  heading: string;
  body?: string;
  action?: React.ReactNode;
}

function EmptyState({ heading, body, action }: EmptyStateProps): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
      <p className="text-base font-semibold text-white">{heading}</p>
      {body && <p className="mt-2 text-sm text-slate-400">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;
