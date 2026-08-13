export type AdEfficiencyInput = {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  conversionValue: number;
};

export function deriveAdEfficiency<T extends AdEfficiencyInput>(item: T) {
  return {
    ...item,
    roas: item.spend > 0 ? Number((item.conversionValue / item.spend).toFixed(2)) : 0,
    ctr: item.impressions > 0 ? Number(((item.clicks / item.impressions) * 100).toFixed(2)) : 0,
    cpc: item.clicks > 0 ? Number((item.spend / item.clicks).toFixed(2)) : 0,
    cpm: item.impressions > 0 ? Number(((item.spend / item.impressions) * 1000).toFixed(2)) : 0,
  };
}

export function summarizeAdTotals(items: AdEfficiencyInput[]) {
  const totals = items.reduce((acc, item) => ({
    totalSpend: acc.totalSpend + item.spend,
    totalClicks: acc.totalClicks + item.clicks,
    totalImpressions: acc.totalImpressions + item.impressions,
    totalConversions: acc.totalConversions + item.conversions,
    totalConversionValue: acc.totalConversionValue + item.conversionValue,
  }), { totalSpend: 0, totalClicks: 0, totalImpressions: 0, totalConversions: 0, totalConversionValue: 0 });

  return {
    ...totals,
    blendedCtr: totals.totalImpressions > 0 ? Number(((totals.totalClicks / totals.totalImpressions) * 100).toFixed(2)) : 0,
    blendedCpc: totals.totalClicks > 0 ? Number((totals.totalSpend / totals.totalClicks).toFixed(2)) : 0,
    blendedCpm: totals.totalImpressions > 0 ? Number(((totals.totalSpend / totals.totalImpressions) * 1000).toFixed(2)) : 0,
    roas: totals.totalSpend > 0 ? Number((totals.totalConversionValue / totals.totalSpend).toFixed(2)) : 0,
  };
}
