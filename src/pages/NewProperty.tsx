import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { trackEvent } from '../lib/analytics';
import { getSupabaseClient } from '../lib/supabaseClient';

interface NewPropertyForm {
  address: string;
  postcode: string;
  type: string;
  bedrooms: string;
}

type FormErrors = Partial<Record<keyof NewPropertyForm, string>>;

const PROPERTY_TYPES = [
  { value: 'flat', label: 'Flat' },
  { value: 'terraced', label: 'Terraced house' },
  { value: 'semi-detached', label: 'Semi-detached house' },
  { value: 'detached', label: 'Detached house' },
  { value: 'bungalow', label: 'Bungalow' },
];

function validate(form: NewPropertyForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.address.trim()) errors.address = 'Address is required.';
  if (!form.postcode.trim()) errors.postcode = 'Postcode is required.';
  if (!form.type) errors.type = 'Property type is required.';
  const beds = Number(form.bedrooms);
  if (!form.bedrooms || isNaN(beds) || beds < 1) {
    errors.bedrooms = 'Enter a valid number of bedrooms.';
  }
  return errors;
}

function NewProperty(): React.JSX.Element {
  const navigate = useNavigate();

  const [form, setForm] = useState<NewPropertyForm>({
    address: '',
    postcode: '',
    type: '',
    bedrooms: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof NewPropertyForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await getSupabaseClient()
        .from('properties')
        .insert({
          address: form.address.trim(),
          postcode: form.postcode.trim().toUpperCase(),
          type: form.type,
          bedrooms: Number(form.bedrooms),
        })
        .select('id')
        .single();

      if (error) {
        setSubmitError(error.message);
        trackEvent('save_failed', { context: 'new_property', message: error.message });
        setIsSubmitting(false);
        return;
      }

      trackEvent('property_created', { propertyId: data.id });
      navigate(`/properties/${data.id}`, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save property.';
      setSubmitError(message);
      trackEvent('save_failed', { context: 'new_property', message });
      setIsSubmitting(false);
    }
  }

  return (
    <Layout title="Add property">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <label htmlFor="np-address" className="text-sm font-medium text-slate-700">
                Address
              </label>
              <input
                id="np-address"
                name="address"
                type="text"
                autoComplete="street-address"
                value={form.address}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. 45 Blenheim Road"
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:opacity-50"
              />
              {errors.address && (
                <p className="text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="np-postcode" className="text-sm font-medium text-slate-700">
                Postcode
              </label>
              <input
                id="np-postcode"
                name="postcode"
                type="text"
                autoComplete="postal-code"
                value={form.postcode}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. SW1A 1AA"
                className="w-40 rounded-xl border border-slate-300 px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:opacity-50"
              />
              {errors.postcode && (
                <p className="text-xs text-red-600">{errors.postcode}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="np-type" className="text-sm font-medium text-slate-700">
                Property type
              </label>
              <select
                id="np-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-56 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:opacity-50"
              >
                <option value="">Select type…</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-xs text-red-600">{errors.type}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="np-bedrooms" className="text-sm font-medium text-slate-700">
                Bedrooms
              </label>
              <input
                id="np-bedrooms"
                name="bedrooms"
                type="number"
                min="1"
                max="20"
                value={form.bedrooms}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. 3"
                className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:opacity-50"
              />
              {errors.bedrooms && (
                <p className="text-xs text-red-600">{errors.bedrooms}</p>
              )}
            </div>

            {submitError && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {submitError}
              </p>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving…' : 'Save property'}
              </button>
              <Link to="/properties" className="text-sm text-slate-500 hover:text-slate-900">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default NewProperty;
