import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { exportEstimatePDF } from '../lib/exportEstimatePDF';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { StoredEstimate } from '../types/estimate';
import type { Item } from '../types/item';
import type { Room } from '../types/room';

type RoomWithItems = Room & { items: Item[] };

function EstimateDetail(): React.JSX.Element {
  const { estimateId } = useParams<{ estimateId: string }>();
  const [estimate, setEstimate] = useState<StoredEstimate | null>(null);
  const [rooms, setRooms] = useState<RoomWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    if (!estimateId) return;
    let cancelled = false;

    async function fetchData(): Promise<void> {
      try {
        const supabase = getSupabaseClient();
        const id = estimateId!;

        const { data: estimateData, error: estError } = await supabase
          .from('estimates')
          .select('*')
          .eq('id', id)
          .single();

        if (estError) {
          if (!cancelled)
            setFetchError(
              estError.code === 'PGRST116' ? 'Estimate not found.' : estError.message,
            );
          return;
        }

        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*, items(*)')
          .eq('estimate_id', id)
          .order('created_at', { ascending: true });

        if (cancelled) return;

        if (roomsError) {
          setFetchError(roomsError.message);
        } else {
          setEstimate(estimateData);
          setRooms((roomsData ?? []) as RoomWithItems[]);
        }
      } catch (err) {
        if (!cancelled)
          setFetchError(err instanceof Error ? err.message : 'Failed to load estimate.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [estimateId]);

  async function handleExport(): Promise<void> {
    if (!estimate) return;
    setIsExporting(true);
    setExportError(null);
    try {
      await exportEstimatePDF({
        description: estimate.description,
        total_cost: estimate.total_cost,
        created_at: estimate.created_at,
        rooms: rooms.map((r) => ({
          name: r.name,
          items: (r.items ?? []).map((i) => ({
            name: i.name,
            category: i.category ?? '',
            quantity: i.quantity ?? 0,
            unit_cost: i.unit_cost ?? 0,
          })),
        })),
      });
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Layout title={estimate?.description ?? 'Estimate'}>
      <div className="grid gap-8">
        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading estimate…
          </div>
        ) : fetchError ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {fetchError}
          </div>
        ) : estimate ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  to={`/properties/${estimate.property_id}`}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to property
                </Link>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{estimate.description}</h2>
                <p className="text-sm text-slate-500">
                  {new Date(estimate.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleExport()}
                disabled={isExporting}
                className="flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Generating…' : 'Export PDF'}
              </button>
            </div>

            {exportError && (
              <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {exportError}
              </p>
            )}

            {/* Total */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Total estimate
              </p>
              <p className="mt-1 text-4xl font-black text-slate-900">
                £{estimate.total_cost.toLocaleString()}
              </p>
            </section>

            {/* Rooms breakdown */}
            {rooms.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                No detailed breakdown available for this estimate.
              </div>
            ) : (
              <div className="grid gap-6">
                {rooms.map((room, index) => {
                  const roomTotal = (room.items ?? []).reduce(
                    (s, i) => s + (i.quantity ?? 0) * (i.unit_cost ?? 0),
                    0,
                  );
                  return (
                    <section
                      key={room.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {index + 1}. {room.name}
                        </h3>
                        <p className="text-sm font-semibold text-slate-700">
                          £{roomTotal.toLocaleString()}
                        </p>
                      </div>

                      {(room.items ?? []).length === 0 ? (
                        <p className="text-sm text-slate-400">No items.</p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                              <th className="pb-2">Item</th>
                              <th className="pb-2">Category</th>
                              <th className="pb-2 text-right">Qty × Cost</th>
                              <th className="pb-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(room.items ?? []).map((item) => {
                              const qty = item.quantity ?? 0;
                              const cost = item.unit_cost ?? 0;
                              return (
                                <tr key={item.id}>
                                  <td className="py-3 font-medium text-slate-900">{item.name}</td>
                                  <td className="py-3 text-slate-500">{item.category}</td>
                                  <td className="py-3 text-right text-slate-500">
                                    {qty} × £{cost.toLocaleString()}
                                  </td>
                                  <td className="py-3 text-right font-semibold text-slate-900">
                                    £{(qty * cost).toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </div>
    </Layout>
  );
}

export default EstimateDetail;
