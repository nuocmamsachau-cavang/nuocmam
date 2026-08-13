import { describe, expect, it } from 'vitest';
import { getApprovedRatingSummary, matchesOrderStatus, matchesProductFilters, paginateItems, sortProducts } from '../shared/catalogFeatures.js';

describe('catalog feature helpers', () => {
  it('filters products by Vietnamese keyword across name and description', () => {
    const product = { name: 'Nước mắm cá nục Sa Châu', description: 'Ủ chượp truyền thống', price: '185000.00' };
    expect(matchesProductFilters(product, { search: 'CÁ NỤC' })).toBe(true);
    expect(matchesProductFilters(product, { search: 'tôm' })).toBe(false);
  });

  it('filters products by inclusive price range', () => {
    const product = { name: 'Cốt đặc biệt', description: null, price: '250000.00' };
    expect(matchesProductFilters(product, { minPrice: 250000, maxPrice: 250000 })).toBe(true);
    expect(matchesProductFilters(product, { minPrice: 250001 })).toBe(false);
  });

  it('paginates blog posts and clamps an out-of-range page', () => {
    const result = paginateItems(['a', 'b', 'c', 'd', 'e'], 4, 2);
    expect(result).toEqual({ items: ['e'], total: 5, page: 3, pageSize: 2, totalPages: 3 });
  });

  it('returns an empty pagination result for no posts', () => {
    expect(paginateItems([], 2, 6)).toEqual({ items: [], total: 0, page: 1, pageSize: 6, totalPages: 0 });
  });

  it('calculates average and count from approved reviews only', () => {
    expect(getApprovedRatingSummary([
      { rating: 5, isApproved: true },
      { rating: 4, isApproved: true },
      { rating: 1, isApproved: false },
    ])).toEqual({ averageRating: 4.5, reviewCount: 2 });
  });

  it('returns zero rating when no review is approved', () => {
    expect(getApprovedRatingSummary([{ rating: 5, isApproved: false }])).toEqual({ averageRating: 0, reviewCount: 0 });
  });

  it('sorts products by price, rating and sales without mutating the source', () => {
    const products = [
      { id: 1, price: '250000', averageRating: 4.2, salesCount: 3, displayOrder: 1 },
      { id: 2, price: '120000', averageRating: 4.8, salesCount: 10, displayOrder: 2 },
      { id: 3, price: '180000', averageRating: 3.9, salesCount: 5, displayOrder: 3 },
    ];
    expect(sortProducts(products, 'priceAsc').map((product) => product.id)).toEqual([2, 3, 1]);
    expect(sortProducts(products, 'ratingDesc').map((product) => product.id)).toEqual([2, 1, 3]);
    expect(sortProducts(products, 'salesDesc').map((product) => product.id)).toEqual([2, 3, 1]);
    expect(products.map((product) => product.id)).toEqual([1, 2, 3]);
  });

  it('matches all orders or only the selected status', () => {
    expect(matchesOrderStatus({ status: 'delivered' }, 'all')).toBe(true);
    expect(matchesOrderStatus({ status: 'delivered' }, 'delivered')).toBe(true);
    expect(matchesOrderStatus({ status: 'pending' }, 'delivered')).toBe(false);
  });
});
