import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import Layout from '../components/Layout';
import { useDesignGenerator } from '../hooks/useDesignGenerator';

const STYLES = [
  'Modern',
  'Scandinavian',
  'Industrial',
  'Classic',
  'Minimalist',
  'Contemporary',
  'Mid-Century',
  'Luxury',
];

function AIDesigner(): React.JSX.Element {
  const [mode, setMode] = useState<'upload' | 'describe'>('upload');
  const [selectedStyle, setSelectedStyle] = useState('Modern');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const { generate, cancel, isGenerating, progress, statusMessage, results, error } =
    useDesignGenerator();

  const generatedImage = results[0]?.url ?? null;

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleGenerate(): Promise<void> {
    await generate({
      mode,
      style: selectedStyle,
      description: description || undefined,
      imageBase64: uploadedImage || undefined,
    });
  }

  const canGenerate =
    !isGenerating &&
    ((mode === 'upload' && uploadedImage !== null) ||
      (mode === 'describe' && description.trim().length > 0));

  return (
    <Layout title="AI Designer">
      <div className="grid gap-8">
        {/* Hero */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI Powered
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            AI Renovation Designer
          </h2>
          <p className="mt-2 text-slate-500">
            Visualise transformations instantly. Perfect for investors and estate agents.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input panel */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            {/* Mode tabs */}
            <div className="mb-6 flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`flex-1 pb-3 text-sm font-medium transition ${
                  mode === 'upload'
                    ? 'border-b-2 border-emerald-500 text-emerald-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Upload Photo
              </button>
              <button
                type="button"
                onClick={() => setMode('describe')}
                className={`flex-1 pb-3 text-sm font-medium transition ${
                  mode === 'describe'
                    ? 'border-b-2 border-emerald-500 text-emerald-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Describe Room
              </button>
            </div>

            {mode === 'upload' ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Room photo
                </label>
                <label
                  htmlFor="photo-upload"
                  className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-emerald-400"
                >
                  <Upload className="mb-3 h-10 w-10 text-slate-400" />
                  <p className="text-sm font-medium text-slate-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-slate-500">PNG, JPG up to 10 MB</p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </label>

                {uploadedImage && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Preview
                    </p>
                    <img
                      src={uploadedImage}
                      alt="Uploaded room"
                      className="max-h-56 w-full rounded-2xl object-cover"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="room-description" className="mb-2 block text-sm font-medium text-slate-700">
                  Describe the room
                </label>
                <textarea
                  id="room-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="e.g. A small Victorian bathroom with original tiles and a clawfoot bath…"
                  className="w-full resize-y rounded-2xl border border-slate-300 p-4 text-sm focus:border-emerald-400 focus:outline-none"
                />
              </div>
            )}

            {/* Style selection */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-slate-700">Design style</p>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      selectedStyle === style
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            {isGenerating && (
              <div className="mt-5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={!canGenerate}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? (statusMessage || 'Generating…') : 'Generate AI Design'}
              </button>

              {isGenerating && (
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </section>

          {/* Preview panel */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Preview</h3>

            {!generatedImage ? (
              <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200">
                <ImageIcon className="mb-3 h-10 w-10 text-slate-300" />
                <p className="text-sm text-slate-400">
                  Your AI-generated design will appear here
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Before
                    </p>
                    <img
                      src={
                        mode === 'upload' && uploadedImage
                          ? uploadedImage
                          : 'https://picsum.photos/seed/before/600/400'
                      }
                      alt="Before renovation"
                      className="aspect-[4/3] w-full rounded-2xl object-cover"
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                      After — {selectedStyle}
                    </p>
                    <img
                      src={generatedImage}
                      alt="After renovation"
                      className="aspect-[4/3] w-full rounded-2xl border-2 border-emerald-400 object-cover"
                    />
                  </div>
                </div>

                {/* Add to estimate — coming soon */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Coming soon
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">Add to Estimate</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Save this design and link it to a refurb estimate.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default AIDesigner;
