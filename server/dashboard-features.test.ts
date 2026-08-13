import { describe, expect, it } from 'vitest';
import { buildDashboardMetrics } from '../shared/dashboardFeatures.js';

describe('Sa Chau dashboard aggregation', () => {
  const products = [
    { id: 1, name: 'Nước mắm Cá Nục 500ml', price: '120000', isActive: true },
    { id: 2, name: 'Nước mắm Cá Mực 500ml', price: '160000', isActive: true },
  ];

  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-1',
      customerName: 'Khách hàng A',
      customerPhone: '0900000001',
      customerEmail: null,
      items: JSON.stringify([{ id: 1, name: 'Nước mắm Cá Nục 500ml', quantity: 2, price: 120000 }]),
      totalAmount: '240000',
      status: 'delivered',
      createdAt: '2026-08-01T10:00:00.000Z',
    },
    {
      id: 2,
      orderNumber: 'ORD-2',
      customerName: 'Khách hàng A',
      customerPhone: '0900000001',
      customerEmail: null,
      items: JSON.stringify([{ id: 2, name: 'Nước mắm Cá Mực 500ml', quantity: 1, price: 160000 }]),
      totalAmount: '160000',
      status: 'cancelled',
      createdAt: '2026-08-02T10:00:00.000Z',
    },
    {
      id: 3,
      orderNumber: 'ORD-3',
      customerName: 'Khách hàng B',
      customerPhone: '0900000002',
      customerEmail: null,
      items: JSON.stringify([{ id: 1, name: 'Nước mắm Cá Nục 500ml', quantity: 1, price: 120000 }]),
      totalAmount: '120000',
      status: 'pending',
      createdAt: '2026-09-03T10:00:00.000Z',
    },
  ];

  it('aggregates revenue, order statuses and excludes cancelled items from sales', () => {
    const result = buildDashboardMetrics(orders, products, []);

    expect(result.summary.totalRevenue).toBe(520000);
    expect(result.summary.totalOrders).toBe(3);
    expect(result.statusCounts.delivered).toBe(1);
    expect(result.statusCounts.cancelled).toBe(1);
    expect(result.topProducts[0]).toMatchObject({ id: 1, salesCount: 3, revenue: 360000 });
    expect(result.topProducts.find((product) => product.id === 2)).toBeUndefined();
  });

  it('filters orders and customer counts by inclusive date range', () => {
    const result = buildDashboardMetrics(orders, products, [], {
      startDate: '2026-08-01',
      endDate: '2026-08-31',
    });

    expect(result.summary.totalOrders).toBe(2);
    expect(result.summary.totalRevenue).toBe(400000);
    expect(result.summary.totalCustomers).toBe(1);
    expect(result.summary.returningCustomers).toBe(1);
    expect(result.revenueSeries).toEqual([{ label: '2026-08', revenue: 400000, orders: 2 }]);
  });

  it('returns a safe empty review summary without inventing review data', () => {
    const result = buildDashboardMetrics([], products, []);

    expect(result.summary.approvedReviews).toBe(0);
    expect(result.summary.averageRating).toBe(0);
    expect(result.topProducts).toEqual([]);
    expect(result.recentOrders).toEqual([]);
  });
});
