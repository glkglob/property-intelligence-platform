import React, { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ComingSoonCard from '../components/ComingSoonCard';
import Layout from '../components/Layout';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { StoredEstimate } from '../types/estimate';
import type { Property } from '../types/property';

function PropertyDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [estimates, setEstimates] = useState<StoredEstimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchData(): Promise<void> {
      try {
        const supabase = getSupabaseClient();
        const propertyId = id!;

        const [propResult, estResult] = await Promise.all([
          supabase.from('properties').select('*').eq('id', propertyId).single(),
          supabase
            .from('estimates')
            .select('*')
            .eq('property_id', propertyId)
            .order('created_at', { ascending: false }),
        ]);

        if (cancelled) return;

        if (propResult.error) {
          setFetchError(
            propResult.error.code === 'PGRST116'
              ? 'Property not found.'
              : propResult.error.message,
          );
        } else if (estResult.error) {
          setFetchError(estResult.error.message);
        } else {
          setProperty(propResult.data);
          setEstimates(estResult.data ?? []);
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

  const latestEstimate = estimates[0] ?? null;

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
          <>
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

            {/* Previous estimates */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Estimates ({estimates.length})
                </h2>
                <Link
                  to={`/estimate/${id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                  <Plus className="h-4 w-4" />
                  New estimate
                </Link>
              </div>

              {estimates.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm text-slate-500">No estimates yet for this property.</p>
                  <Link
                    to={`/estimate/${id}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
                  >
                    <Plus className="h-4 w-4" />
                    Create first estimate
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {estimates.map((estimate) => (
                    <Link
                      key={estimate.id}
                      to={`/estimates/${estimate.id}`}
                      className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {new Date(estimate.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-slate-500">{estimate.description}</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-slate-900">
                        £{estimate.total_cost.toLocaleString()}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>

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
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-400"
                  >
                    <Plus className="h-4 w-4" />
                    New estimate
                  </Link>
                </div>

                {latestEstimate ? (
                  <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="font-semibold text-slate-900">Deal Copilot</p>
                    <p className="text-sm text-slate-500">
                      Score this deal — enter purchase price and GDV to get a proceed/review/reject
                      recommendation.
                    </p>
                    <Link
                      to={`/deal/${id}`}
                      className="mt-auto inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Analyse deal
                    </Link>
                  </div>
                ) : (
                  <ComingSoonCard featureName="Deal Copilot" />
                )}
                <ComingSoonCard featureName="Refurb IQ" />
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Property not found.</p>
          </section>
        )}

        <Link to="/properties" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to properties
        </Link>
      </div>
    </Layout>
  );
}

export default PropertyDetail;
