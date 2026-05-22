import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, Save, Trash2 } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { generateEstimatePDF } from '../lib/generateEstimatePDF';
import { getSupabaseClient } from '../lib/supabaseClient';

interface LineItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit_cost: number;
}

interface Room {
  id: string;
  name: string;
  items: LineItem[];
}

interface EstimateFormProps {
  propertyId?: string;
}

function EstimateForm({ propertyId }: EstimateFormProps): React.JSX.Element {
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [rooms, setRooms] = useState<Room[]>([
    { id: crypto.randomUUID(), name: 'Kitchen', items: [] },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<
    { type: 'success'; id: string } | { type: 'error'; message: string } | null
  >(null);

  const totalCost = rooms.reduce(
    (sum, room) =>
      sum + room.items.reduce((itemSum, item) => itemSum + item.quantity * item.unit_cost, 0),
    0,
  );

  function addRoom(): void {
    setRooms((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Room ${prev.length + 1}`,
        items: [],
      },
    ]);
  }

  function updateRoomName(roomId: string, name: string): void {
    setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, name } : room)));
  }

  function removeRoom(roomId: string): void {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
  }

  function addItem(roomId: string): void {
    const blankItem: LineItem = {
      id: crypto.randomUUID(),
      name: 'New item',
      category: 'Materials',
      quantity: 1,
      unit_cost: 0,
    };

    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, items: [...room.items, blankItem] } : room,
      ),
    );
  }

  function updateItem<K extends keyof LineItem>(
    roomId: string,
    itemId: string,
    field: K,
    value: LineItem[K],
  ): void {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              items: room.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
              ),
            }
          : room,
      ),
    );
  }

  function removeItem(roomId: string, itemId: string): void {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, items: room.items.filter((item) => item.id !== itemId) }
          : room,
      ),
    );
  }

  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    if (!propertyId) {
      setSaveResult({ type: 'error', message: 'No property selected — cannot save.' });
      return;
    }

    if (rooms.length === 0) {
      setSaveResult({ type: 'error', message: 'Add at least one room before saving.' });
      return;
    }

    if (totalCost === 0) {
      setSaveResult({ type: 'error', message: 'Add at least one item before saving.' });
      return;
    }

    setIsSaving(true);
    setSaveResult(null);

    let estimateId: string | null = null;

    try {
      const supabase = getSupabaseClient();

      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .insert({
          property_id: propertyId,
          description: description.trim() || 'Refurbishment estimate',
          total_cost: totalCost,
          refurb_budget: totalCost,
        })
        .select('id')
        .single();

      if (estimateError) throw new Error(estimateError.message);
      if (!estimate?.id) throw new Error('Estimate was created without an id.');

      estimateId = estimate.id;

      for (const [roomIndex, room] of rooms.entries()) {
        const roomName = room.name.trim() || 'Unnamed room';

        const { data: savedRoom, error: roomError } = await supabase
          .from('rooms')
          .insert({
            estimate_id: estimate.id,
            name: roomName,
            display_order: roomIndex,
          })
          .select('id')
          .single();

        if (roomError) throw new Error(roomError.message);
        if (!savedRoom?.id) throw new Error(`Room "${roomName}" was created without an id.`);

        if (room.items.length > 0) {
          const { error: itemsError } = await supabase.from('items').insert(
            room.items.map((item, itemIndex) => ({
              room_id: savedRoom.id,
              name: item.name.trim() || 'Unnamed item',
              category: item.category,
              quantity: item.quantity,
              unit_cost: item.unit_cost,
              display_order: itemIndex,
            })),
          );

          if (itemsError) throw new Error(itemsError.message);
        }
      }

      trackEvent('estimate_completed', {
        propertyId,
        estimateId: estimate.id,
        total: totalCost,
      });

      setSaveResult({ type: 'success', id: estimate.id });
      navigate(`/estimates/${estimate.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed.';

      trackEvent('save_failed', {
        context: 'estimate',
        message,
      });

      if (estimateId) {
        const supabase = getSupabaseClient();
        void supabase.from('estimates').delete().eq('id', estimateId);
      }

      setSaveResult({ type: 'error', message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full refurbishment"
            className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </label>
      </div>

      <div className="grid gap-4">
        {rooms.map((room) => {
          const roomTotal = room.items.reduce(
            (sum, item) => sum + item.quantity * item.unit_cost,
            0,
          );

          return (
            <div
              key={room.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => updateRoomName(room.id, e.target.value)}
                  className="flex-1 border-b border-slate-200 pb-1 text-lg font-semibold text-slate-900 focus:border-slate-900 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className="text-slate-400 hover:text-red-500"
                  aria-label={`Remove ${room.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {room.items.length > 0 && (
                <div className="mb-4">
                  <div className="mb-2 grid grid-cols-12 gap-2 px-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-right">Unit cost</div>
                    <div className="col-span-1 text-right">Total</div>
                    <div className="col-span-1" />
                  </div>

                  <div className="divide-y divide-slate-100">
                    {room.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 items-center gap-2 py-2">
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(room.id, item.id, 'name', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>

                        <div className="col-span-2">
                          <select
                            value={item.category}
                            onChange={(e) =>
                              updateItem(room.id, item.id, 'category', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                          >
                            <option>Materials</option>
                            <option>Labour</option>
                            <option>Fixtures</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div className="col-span-1">
                          <input
                            type="number"
                            min={0}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                room.id,
                                item.id,
                                'quantity',
                                Math.max(0, parseFloat(e.target.value) || 0),
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center rounded-lg border border-slate-200 px-2 py-1.5">
                            <span className="mr-1 text-sm text-slate-400">£</span>
                            <input
                              type="number"
                              min={0}
                              value={item.unit_cost}
                              onChange={(e) =>
                                updateItem(
                                  room.id,
                                  item.id,
                                  'unit_cost',
                                  Math.max(0, parseFloat(e.target.value) || 0),
                                )
                              }
                              className="w-full text-right text-sm text-slate-900 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="col-span-1 text-right text-sm font-medium text-slate-900">
                          £{(item.quantity * item.unit_cost).toLocaleString()}
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeItem(room.id, item.id)}
                            className="text-slate-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-end border-t border-slate-100 pt-3 text-sm">
                    <span className="text-slate-500">Room total</span>
                    <span className="ml-4 font-semibold text-slate-900">
                      £{roomTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => addItem(room.id)}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Add item
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addRoom}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <Plus className="h-4 w-4" />
        Add room
      </button>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Total estimate</span>
          <span className="text-3xl font-black text-slate-900">
            £{totalCost.toLocaleString()}
          </span>
        </div>

        {saveResult?.type === 'success' && (
          <div
            role="status"
            className="mb-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3"
          >
            <p className="text-sm text-emerald-700">Estimate saved successfully.</p>

            <button
              type="button"
              onClick={() =>
                generateEstimatePDF({
                  description: description.trim() || 'Refurbishment estimate',
                  totalCost,
                  createdAt: new Date(),
                  rooms: rooms.map((room) => ({
                    name: room.name,
                    items: room.items.map((item) => ({
                      name: item.name,
                      category: item.category,
                      quantity: item.quantity,
                      unit_cost: item.unit_cost,
                    })),
                  })),
                })
              }
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </button>
          </div>
        )}

        {saveResult?.type === 'error' && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {saveResult.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-40"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving…' : 'Save estimate'}
        </button>
      </div>
    </form>
  );
}

export default EstimateForm;