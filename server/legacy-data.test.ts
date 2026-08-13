import { describe, expect, it } from 'vitest';
import { buildLegacyTrpcUrl, unwrapLegacyTrpcResponse } from './legacyData.js';

describe('legacy data fallback', () => {
  it('builds a tRPC URL with the standard JSON input envelope', () => {
    const url = buildLegacyTrpcUrl('products.list', { sort: 'salesDesc' });
    expect(url).toContain('/api/trpc/products.list?input=');
    expect(decodeURIComponent(url)).toContain('"json":{"sort":"salesDesc"}');
  });

  it('unwraps successful tRPC responses', () => {
    expect(unwrapLegacyTrpcResponse({ result: { data: { json: { totalOrders: 1 } } } })).toEqual({ totalOrders: 1 });
  });

  it('raises a useful error for failed tRPC responses', () => {
    expect(() => unwrapLegacyTrpcResponse({ error: { json: { message: 'Invalid credentials' } } })).toThrow('Invalid credentials');
  });
});
