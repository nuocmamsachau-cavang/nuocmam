const DEFAULT_LEGACY_ORIGIN = 'https://nuocmampro-fdjnndux.manus.space';

export function getLegacyDataOrigin() {
  return (process.env.LEGACY_DATA_ORIGIN || DEFAULT_LEGACY_ORIGIN).replace(/\/$/, '');
}

export function buildLegacyTrpcUrl(path: string, input: unknown = {}) {
  const encodedInput = encodeURIComponent(JSON.stringify({ json: input }));
  return `${getLegacyDataOrigin()}/api/trpc/${path}?input=${encodedInput}`;
}

export function unwrapLegacyTrpcResponse(payload: any) {
  if (payload?.error) {
    throw new Error(payload.error.json?.message || payload.error.message || 'Legacy data request failed');
  }
  return payload?.result?.data?.json ?? payload?.result?.data;
}

export async function fetchLegacyTrpc<T = unknown>(path: string, input: unknown = {}, method: 'GET' | 'POST' = 'GET'): Promise<T> {
  const response = await fetch(method === 'GET' ? buildLegacyTrpcUrl(path, input) : `${getLegacyDataOrigin()}/api/trpc/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(method === 'POST' ? { body: JSON.stringify({ json: input }) } : {}),
  });

  if (!response.ok) {
    throw new Error(`Legacy data request returned HTTP ${response.status}`);
  }

  return unwrapLegacyTrpcResponse(await response.json()) as T;
}

export const hasLocalDatabase = () => Boolean(process.env.DATABASE_URL);

export const LEGACY_DATA_ORIGIN = DEFAULT_LEGACY_ORIGIN;
