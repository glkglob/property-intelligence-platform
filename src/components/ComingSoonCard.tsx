import React from 'react';

interface ComingSoonCardProps {
  featureName: string;
}

function ComingSoonCard({ featureName }: ComingSoonCardProps): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <p className="text-sm font-medium text-emerald-400">Coming soon</p>
      <p className="mt-1 text-base font-semibold text-white">{featureName}</p>
      <p className="mt-2 text-sm text-slate-400">
        This feature is in development and will be available in a future release.
      </p>
    </div>
  );
}

export default ComingSoonCard;
