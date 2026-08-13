export const DASHBOARD_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

export type DashboardStatus = (typeof DASHBOARD_STATUSES)[number];

export type DashboardDateFilter = {
  startDate?: string;
  endDate?: string;
};

export type DashboardOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  items: string;
  totalAmount: string | number;
  status: string;
  createdAt: Date | string;
};

export type DashboardProduct = {
  id: number;
  name: string;
  price: string | number;
  isActive?: boolean;
};

export type DashboardReview = {
  rating: number;
  isApproved?: boolean | null;
};

export type DashboardMetrics = {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    activeProducts: number;
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    approvedReviews: number;
    averageRating: number;
  };
  statusCounts: Record<DashboardStatus, number>;
  revenueSeries: Array<{ label: string; revenue: number; orders: number }>;
  topProducts: Array<{ id: number | null; name: string; salesCount: number; revenue: number }>;
  recentOrders: DashboardOrder[];
};

type ParsedItem = {
  id?: number;
  productId?: number;
  name?: string;
  price?: number | string;
  quantity?: number | string;
};

function parseItems(raw: string): ParsedItem[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.items)) return parsed.items;
    return [];
  } catch {
    return [];
  }
}

function toDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isWithinDateRange(value: Date | string, filter: DashboardDateFilter) {
  const date = toDate(value);
  if (!date) return false;
  if (filter.startDate) {
    const start = new Date(`${filter.startDate}T00:00:00`);
    if (!Number.isNaN(start.getTime()) && date < start) return false;
  }
  if (filter.endDate) {
    const end = new Date(`${filter.endDate}T23:59:59.999`);
    if (!Number.isNaN(end.getTime()) && date > end) return false;
  }
  return true;
}

function customerKey(order: DashboardOrder) {
  const phone = order.customerPhone?.trim();
  if (phone) return `phone:${phone}`;
  const email = order.customerEmail?.trim().toLocaleLowerCase('vi-VN');
  if (email) return `email:${email}`;
  return `name:${order.customerName.trim().toLocaleLowerCase('vi-VN')}`;
}

function monthKey(value: Date | string) {
  const date = toDate(value);
  if (!date) return 'Không xác định';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function buildDashboardMetrics(
  orders: DashboardOrder[],
  products: DashboardProduct[],
  reviews: DashboardReview[],
  filter: DashboardDateFilter = {},
): DashboardMetrics {
  const filteredOrders = orders
    .filter((order) => isWithinDateRange(order.createdAt, filter))
    .sort((a, b) => (toDate(b.createdAt)?.getTime() ?? 0) - (toDate(a.createdAt)?.getTime() ?? 0));
  const statusCounts = Object.fromEntries(DASHBOARD_STATUSES.map((status) => [status, 0])) as Record<DashboardStatus, number>;
  const revenueByMonth = new Map<string, { revenue: number; orders: number }>();
  const customerOrderCounts = new Map<string, number>();
  const productMap = new Map<number, { name: string; salesCount: number; revenue: number }>();
  const knownProducts = new Map(products.map((product) => [product.id, product]));

  let totalRevenue = 0;
  for (const order of filteredOrders) {
    const amount = Number(order.totalAmount);
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    totalRevenue += safeAmount;
    if (order.status in statusCounts) statusCounts[order.status as DashboardStatus] += 1;
    const month = monthKey(order.createdAt);
    const monthly = revenueByMonth.get(month) ?? { revenue: 0, orders: 0 };
    monthly.revenue += safeAmount;
    monthly.orders += 1;
    revenueByMonth.set(month, monthly);
    const identity = customerKey(order);
    customerOrderCounts.set(identity, (customerOrderCounts.get(identity) ?? 0) + 1);

    if (order.status === 'cancelled') continue;
    for (const item of parseItems(order.items)) {
      const idValue = item.id ?? item.productId;
      const id = typeof idValue === 'number' && Number.isFinite(idValue) ? idValue : null;
      const quantity = Math.max(0, Number(item.quantity ?? 0));
      const unitPrice = Math.max(0, Number(item.price ?? (id ? knownProducts.get(id)?.price : 0)));
      if (!quantity) continue;
      const current = id === null
        ? undefined
        : productMap.get(id);
      if (current) {
        current.salesCount += quantity;
        current.revenue += unitPrice * quantity;
      } else if (id !== null) {
        productMap.set(id, {
          name: knownProducts.get(id)?.name ?? item.name ?? `Sản phẩm #${id}`,
          salesCount: quantity,
          revenue: unitPrice * quantity,
        });
      }
    }
  }

  const approvedRatings = reviews.filter((review) => review.isApproved === undefined || review.isApproved === true);
  const approvedReviews = approvedRatings.length;
  const averageRating = approvedReviews === 0
    ? 0
    : Number((approvedRatings.reduce((sum, review) => sum + Number(review.rating || 0), 0) / approvedReviews).toFixed(1));
  const totalCustomers = customerOrderCounts.size;
  const returningCustomers = Array.from(customerOrderCounts.values()).filter((count) => count > 1).length;

  return {
    summary: {
      totalRevenue,
      totalOrders: filteredOrders.length,
      totalProducts: products.length,
      activeProducts: products.filter((product) => product.isActive !== false).length,
      totalCustomers,
      newCustomers: totalCustomers - returningCustomers,
      returningCustomers,
      approvedReviews,
      averageRating,
    },
    statusCounts,
    revenueSeries: Array.from(revenueByMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, values]) => ({ label, ...values })),
    topProducts: Array.from(productMap.entries())
      .map(([id, values]) => ({ id, ...values }))
      .sort((a, b) => b.salesCount - a.salesCount || b.revenue - a.revenue)
      .slice(0, 8),
    recentOrders: filteredOrders.slice(0, 5),
  };
}
