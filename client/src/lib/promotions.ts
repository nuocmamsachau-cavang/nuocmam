export interface PromotionRecord {
  id: number;
  code: string;
  discountPercent: number;
  startDate: Date | string;
  endDate: Date | string;
  description?: string | null;
  isActive?: boolean | null;
}

export interface PromotionCardData {
  id: number | string;
  title: string;
  description: string;
  discount: string;
  backgroundColor: string;
  textColor: string;
}

export const FALLBACK_PROMOTION_CARDS: PromotionCardData[] = [
  {
    id: 'fallback-special',
    title: 'Khuyến Mãi Đặc Biệt',
    description: 'Giảm 20% cho đơn hàng từ 500.000₫',
    discount: '20%',
    backgroundColor: '#C41E3A',
    textColor: '#D4AF37',
  },
  {
    id: 'fallback-buy-two',
    title: 'Mua 2 Tặng 1',
    description: 'Mua 2 chai nước mắm, tặng 1 chai cùng loại',
    discount: 'Tặng 1',
    backgroundColor: '#8B1428',
    textColor: '#D4AF37',
  },
];

export function isPromotionActive(promotion: PromotionRecord, now = new Date()): boolean {
  if (promotion.isActive === false) return false;

  const start = new Date(promotion.startDate).getTime();
  const end = new Date(promotion.endDate).getTime();
  const current = now.getTime();

  return Number.isFinite(start) && Number.isFinite(end) && start <= current && current <= end;
}

export function mapPromotionToCard(
  promotion: PromotionRecord,
  index: number,
): PromotionCardData {
  const isBuyTwoGetOne = promotion.code.trim().toUpperCase() === 'MUA2TANG1';
  const discount = isBuyTwoGetOne ? 'Tặng 1' : `${promotion.discountPercent}%`;
  const description = promotion.description?.trim()
    || (isBuyTwoGetOne
      ? 'Mua 2 chai nước mắm, tặng 1 chai cùng loại.'
      : `Nhập mã ${promotion.code} để nhận ưu đãi ${discount}`);

  return {
    id: promotion.id,
    title: isBuyTwoGetOne ? 'Mua 2 Tặng 1' : `Ưu Đãi ${discount}`,
    description,
    discount,
    backgroundColor: index % 2 === 0 ? '#C41E3A' : '#8B1428',
    textColor: '#D4AF37',
  };
}

export function getPromotionCards(
  promotions: PromotionRecord[] | undefined,
  now = new Date(),
): PromotionCardData[] {
  const activePromotions = (promotions || [])
    .filter((promotion) => isPromotionActive(promotion, now))
    .map((promotion, index) => mapPromotionToCard(promotion, index));

  return activePromotions.length > 0 ? activePromotions : FALLBACK_PROMOTION_CARDS;
}
