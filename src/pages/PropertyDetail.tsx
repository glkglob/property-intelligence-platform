import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ComingSoonCard from '../components/ComingSoonCard';
import Layout from '../components/Layout';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { StoredEstimate } from '../types/estimate';
import type { Property } from '../types/property';

function PropertyDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [latestEstimate, setLatestEstimate] = useState<Pick<
    StoredEstimate,
    'id' | 'total_cost' | 'created_at'
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchData(): Promise<void> {
      try {
        const supabase = getSupabaseClient();

        const [propResult, estResult] = await Promise.all([
          supabase.from('properties').select('*').eq('id', id).single(),
          supabase
            .from('estimates')
            .select('id, total_cost, created_at')
            .eq('property_id', id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        if (cancelled) return;

        if (propResult.error) {
          setFetchError(
            propResult.error.code === 'PGRST116'
              ? 'Property not found.'
              : propResult.error.message,
          );
        } else {
          setProperty(propResult.data);
          setLatestEstimate(estResult.data ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(
            err instanceof Error ? err.message : 'Failed to load property.',
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <Layout title={property?.address ?? 'Property'}>
      <div className="grid gap-8">
        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading property…
          </div>
        ) : fetchError ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {fetchError}
          </div>
        ) : property ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{property.address}</h2>
            <dl className="mt-4 grid gap-1 text-sm">
              <div>
                <dt className="inline font-medium text-slate-700">Postcode </dt>
                <dd className="inline text-slate-600">{property.postcode}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-700">Type </dt>
                <dd className="inline text-slate-600">{property.type}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-700">Bedrooms </dt>
                <dd className="inline text-slate-600">{property.bedrooms}</dd>
              </div>
            </dl>

            {latestEstimate && (
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Latest estimate
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  £{latestEstimate.total_cost.toLocaleString()}
                </p>
                <Link
                  to={`/estimate/${id}`}
                  className="mt-2 inline-block text-sm text-slate-500 hover:text-slate-900"
                >
                  Run new estimate →
                </Link>
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Property not found.</p>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Next actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-slate-900">Refurb estimate</p>
              <p className="text-sm text-slate-500">
                Select works and get an instant cost estimate.
              </p>
              <Link
                to={`/estimate/${id}`}
                className="mt-auto rounded-xl bg-slate-950 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
              >
                Run estimate
              </Link>
            </div>

            <ComingSoonCard featureName="Deal Copilot" />
            <ComingSoonCard featureName="Refurb IQ" />
          </div>
        </section>

        <Link to="/properties" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to properties
        </Link>
      </div>
    </Layout>
  );
}

export default PropertyDetail;
