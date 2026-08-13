import { describe, expect, it } from 'vitest';
import { deriveAdEfficiency, summarizeAdTotals } from '../shared/adFeatures.js';

describe('ad metric aggregation', () => {
  it('calculates ROAS and efficiency metrics from real-shaped campaign rows', () => {
    expect(deriveAdEfficiency({
      spend: 500000,
      impressions: 100000,
      clicks: 2500,
      conversions: 20,
      conversionValue: 1500000,
    })).toMatchObject({
      roas: 3,
      ctr: 2.5,
      cpc: 200,
      cpm: 5000,
    });
  });

  it('returns safe zero metrics when there is no spend or traffic', () => {
    expect(deriveAdEfficiency({ spend: 0, impressions: 0, clicks: 0, conversions: 0, conversionValue: 0 })).toMatchObject({
      roas: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
    });
  });

  it('summarizes totals across multiple platforms without inventing missing values', () => {
    expect(summarizeAdTotals([
      { spend: 100, impressions: 1000, clicks: 100, conversions: 4, conversionValue: 400 },
      { spend: 300, impressions: 2000, clicks: 100, conversions: 6, conversionValue: 800 },
    ])).toEqual({
      totalSpend: 400,
      totalClicks: 200,
      totalImpressions: 3000,
      totalConversions: 10,
      totalConversionValue: 1200,
      blendedCtr: 6.67,
      blendedCpc: 2,
      blendedCpm: 133.33,
      roas: 3,
    });
  });
});
