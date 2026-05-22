export type ImageResponseFormat = 'url' | 'b64_json';

export interface GenerateDesignParams {
  mode: 'upload' | 'describe';
  style: string;
  description?: string;
  imageBase64?: string;
  count?: number;
  responseFormat?: ImageResponseFormat;
}

export interface GenerateDesignResult {
  url: string;
  revisedPrompt?: string;
}

export interface GenerateDesignOptions {
  onProgress?: (progress: number, message: string) => void;
  signal?: AbortSignal;
}

interface GrokImageItem {
  url?: string;
  b64_json?: string;
  revised_prompt?: string;
}

interface GrokImageResponse {
  data: GrokImageItem[];
}

interface GrokErrorResponse {
  error?: { message?: string };
}

class GrokClientError extends Error {}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 800;
const COST_PER_IMAGE_USD = 0.04;

export async function generateDesignImage(
  params: GenerateDesignParams,
  options: GenerateDesignOptions = {},
): Promise<GenerateDesignResult[]> {
  const {
    mode,
    style,
    description,
    imageBase64,
    count = 1,
    responseFormat = 'url',
  } = params;
  const { onProgress, signal } = options;

  const apiKey = import.meta.env.VITE_XAI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('Missing VITE_XAI_API_KEY. Please add it to your .env.local file.');
  }

  const prompt = buildPrompt({ mode, style, description });
  const n = Math.min(Math.max(count, 1), 4);

  onProgress?.(10, 'Preparing request…');

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      onProgress?.(
        20 + (attempt - 1) * 15,
        `Generating image${n > 1 ? 's' : ''} (attempt ${attempt})…`,
      );

      const response = await fetch('https://api.x.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-2-image-1212',
          prompt,
          n,
          size: '1024x1024',
          response_format: responseFormat,
          // Uncomment when xAI supports image-to-image:
          // ...(imageBase64 && { image: imageBase64 }),
        }),
        signal,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as GrokErrorResponse;
        const message = body.error?.message ?? `Grok API error (${response.status})`;
        if (response.status === 401 || response.status === 400) {
          throw new GrokClientError(message);
        }
        throw new Error(message);
      }

      onProgress?.(70, 'Processing results…');

      const data = await response.json() as GrokImageResponse;
      const results: GenerateDesignResult[] = (data.data ?? []).map((item) => {
        const raw =
          responseFormat === 'b64_json' && item.b64_json
            ? `data:image/png;base64,${item.b64_json}`
            : item.url;
        if (!raw) throw new Error('No image URL in Grok response');
        return { url: raw, revisedPrompt: item.revised_prompt };
      });

      if (results.length === 0) throw new Error('No images returned from Grok API');

      // eslint-disable-next-line no-console
      console.log(
        `[Grok Imagine] ${n} image(s) — est. cost $${(n * COST_PER_IMAGE_USD).toFixed(2)}`,
      );

      onProgress?.(100, 'Done');
      return results;
    } catch (err) {
      if (signal?.aborted) throw new Error('Request was cancelled');
      lastError = err instanceof Error ? err : new Error('Unknown error');
      if (err instanceof GrokClientError) break;
      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        onProgress?.(30 + attempt * 10, `Retrying in ${delay / 1000}s…`);
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error('Failed to generate image');
}

function buildPrompt({
  mode,
  style,
  description,
}: Pick<GenerateDesignParams, 'mode' | 'style' | 'description'>): string {
  const modeLabel = mode === 'upload' ? 'Full redesign' : 'Inspirational mood';
  let prompt =
    `Professional UK property refurbishment visualisation. ` +
    `Style: ${style}. Mode: ${modeLabel}. ` +
    `Photorealistic, natural lighting, premium finishes suited to British residential homes.`;
  if (description) prompt += ` ${description}.`;
  return prompt;
}
