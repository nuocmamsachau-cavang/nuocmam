import { describe, expect, it } from 'vitest';
import { PUBLIC_CHANNELS } from '../client/src/pages/SaChauOperations';

describe('Sa Chau public channel links', () => {
  it('keeps the five verified public channels available in the operations dashboard', () => {
    expect(PUBLIC_CHANNELS.map((channel) => channel.label)).toEqual([
      'Facebook Page',
      'Website bán hàng',
      'Instagram',
      'TikTok',
      'Google Maps',
    ]);
    expect(new Set(PUBLIC_CHANNELS.map((channel) => channel.url)).size).toBe(5);
    for (const channel of PUBLIC_CHANNELS) {
      expect(channel.url).toMatch(/^https:\/\//);
    }
  });
});
