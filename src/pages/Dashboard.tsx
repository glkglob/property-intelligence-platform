import React, { useEffect, useState } from 'react';
import { FileText, Home, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { StoredEstimate } from '../types/estimate';
import type { Property } from '../types/property';

function Dashboard(): React.JSX.Element {
  const [properties, setProperties] = useState<Property[]>([]);
  const [recentEstimates, setRecentEstimates] = useState<StoredEstimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData(): Promise<void> {
      try {
        const supabase = getSupabaseClient();

        const [propResult, estResult] = await Promise.all([
          supabase.from('properties').select('*').order('created_at', { ascending: false }),
          supabase
            .from('estimates')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        if (cancelled) return;
        setProperties(propResult.data ?? []);
        setRecentEstimates(estResult.data ?? []);
      } catch (err) {
        if (!cancelled) console.error('Dashboard fetch error:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const estimatesTotalCost = recentEstimates.reduce((sum, e) => sum + e.total_cost, 0);

  return (
    <Layout title="Dashboard">
      <div className="grid gap-10">
        {/* Header actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/properties/new"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            New property
          </Link>
          <Link
            to="/properties"
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400"
          >
            All properties
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Properties</p>
                <p className="mt-0.5 text-3xl font-black text-slate-900">{properties.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Recent estimates</p>
                <p className="mt-0.5 text-3xl font-black text-slate-900">{recentEstimates.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Refurb cost (last 5)</p>
                <p className="mt-0.5 text-3xl font-black text-slate-900">
                  £{estimatesTotalCost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading…
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent properties */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Recent properties</h2>
                <Link to="/properties" className="text-sm text-slate-500 hover:text-slate-900">
                  View all
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                  No properties yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {properties.slice(0, 4).map((property) => (
                    <Link
                      key={property.id}
                      to={`/properties/${property.id}`}
                      className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{property.address}</p>
                        <p className="text-sm text-slate-500">{property.postcode}</p>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <p>{property.type}</p>
                        <p>{property.bedrooms} beds</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Recent estimates */}
            <section>
              <h2 className="mb-4 text-sm font-semibold text-slate-900">Recent estimates</h2>

              {recentEstimates.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                  No estimates yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {recentEstimates.map((estimate) => (
                    <div
                      key={estimate.id}
                      className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {new Date(estimate.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-slate-500">{estimate.description}</p>
                      </div>
                      <p className="text-xl font-bold text-slate-900">
                        £{estimate.total_cost.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
