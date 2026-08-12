export type ProductFilterInput = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type RatingInput = {
  rating: number;
  isApproved?: boolean | null;
};

export function matchesProductFilters(
  product: { name: string; description: string | null; price: string | number },
  filters: ProductFilterInput = {},
) {
  const keyword = filters.search?.trim().toLocaleLowerCase('vi-VN');
  const haystack = `${product.name} ${product.description ?? ''}`.toLocaleLowerCase('vi-VN');
  const price = Number(product.price);
  return (!keyword || haystack.includes(keyword))
    && (filters.minPrice === undefined || price >= filters.minPrice)
    && (filters.maxPrice === undefined || price <= filters.maxPrice);
}

export function paginateItems<T>(items: T[], page = 1, pageSize = 6) {
  const normalizedPageSize = Math.min(Math.max(pageSize, 1), 24);
  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / normalizedPageSize);
  const currentPage = totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * normalizedPageSize;
  return {
    items: items.slice(start, start + normalizedPageSize),
    total,
    page: currentPage,
    pageSize: normalizedPageSize,
    totalPages,
  };
}

export function getApprovedRatingSummary(reviews: RatingInput[]) {
  const approved = reviews.filter((review) => review.isApproved === undefined || review.isApproved === true);
  const reviewCount = approved.length;
  const averageRating = reviewCount === 0
    ? 0
    : Number((approved.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1));
  return { averageRating, reviewCount };
}
