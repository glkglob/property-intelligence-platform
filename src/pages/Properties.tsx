import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Property } from '../types/property';

function Properties(): React.JSX.Element {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProperties(): Promise<void> {
      try {
        const { data, error } = await getSupabaseClient()
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (cancelled) return;
        if (error) {
          setFetchError(error.message);
        } else {
          setProperties(data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(
            err instanceof Error ? err.message : 'Failed to load properties.',
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProperties();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout title="Properties">
      <div className="mb-6 flex items-center justify-between">
        {!isLoading && !fetchError && (
          <p className="text-sm text-slate-500">
            {properties.length === 0
              ? 'No properties yet'
              : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}`}
          </p>
        )}
        <Link
          to="/properties/new"
          className="ml-auto rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add property
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading properties…
        </div>
      ) : fetchError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
          {fetchError}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">No properties yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Add your first property to start running estimates and deal analysis.
          </p>
          <Link
            to="/properties/new"
            className="mt-6 inline-block rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add your first property
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
            >
              <p className="text-lg font-bold text-slate-900">{property.address}</p>
              <p className="mt-1 text-sm text-slate-500">
                {property.postcode}
                {property.bedrooms > 0 && ` · ${property.bedrooms} bed`}
                {property.type && ` · ${property.type}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Properties;
