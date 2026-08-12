import { describe, expect, it } from 'vitest';
import { FALLBACK_PROMOTION_CARDS, getPromotionCards, isPromotionActive, mapPromotionToCard } from '../client/src/lib/promotions';

const now = new Date('2026-08-12T12:00:00.000Z');

const activePromotion = {
  id: 10,
  code: 'SA-20',
  discountPercent: 20,
  startDate: '2026-08-01T00:00:00.000Z',
  endDate: '2026-08-31T23:59:59.000Z',
  description: 'Giảm 20% cho đơn từ 500.000đ',
  isActive: true,
};

describe('Dynamic promotions', () => {
  it('recognizes only promotions inside their active window', () => {
    expect(isPromotionActive(activePromotion, now)).toBe(true);
    expect(isPromotionActive({ ...activePromotion, startDate: '2026-08-13T00:00:00.000Z' }, now)).toBe(false);
    expect(isPromotionActive({ ...activePromotion, endDate: '2026-08-11T23:59:59.000Z' }, now)).toBe(false);
    expect(isPromotionActive({ ...activePromotion, isActive: false }, now)).toBe(false);
  });

  it('maps a database record to a branded homepage card', () => {
    expect(mapPromotionToCard(activePromotion, 0)).toEqual({
      id: 10,
      title: 'Ưu Đãi 20%',
      description: 'Giảm 20% cho đơn từ 500.000đ',
      discount: '20%',
      backgroundColor: '#C41E3A',
      textColor: '#D4AF37',
    });
  });

  it('shows active database promotions instead of fallback cards', () => {
    const cards = getPromotionCards([activePromotion], now);
    expect(cards).toHaveLength(1);
    expect(cards[0].id).toBe(10);
  });

  it('falls back safely when there are no active promotions', () => {
    const cards = getPromotionCards([
      { ...activePromotion, endDate: '2026-08-11T23:59:59.000Z' },
    ], now);
    expect(cards).toEqual(FALLBACK_PROMOTION_CARDS);
  });
});
