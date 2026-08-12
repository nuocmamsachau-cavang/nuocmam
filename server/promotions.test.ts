import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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


describe('Promotion CRUD integration', () => {
  let db: any;
  let promotionId: number | undefined;
  const testCode = `TEST-CRUD-${Date.now()}`;

  beforeAll(async () => {
    const { getDb } = await import('./db');
    db = await getDb();
  });

  it('creates, updates, reads and deletes a promotion record', async () => {
    if (!db) return;
    const { promotions } = await import('../drizzle/schema');
    const { eq } = await import('drizzle-orm');
    const startDate = new Date('2026-08-12T00:00:00.000Z');
    const endDate = new Date('2026-08-31T23:59:59.000Z');

    await db.insert(promotions).values({
      code: testCode,
      discountPercent: 15,
      startDate,
      endDate,
      description: 'Temporary CRUD test promotion',
      isActive: true,
    });
    const created = await db.select().from(promotions).where(eq(promotions.code, testCode)).limit(1);
    expect(created).toHaveLength(1);
    promotionId = created[0].id;

    await db.update(promotions).set({ discountPercent: 25, isActive: false }).where(eq(promotions.id, promotionId));
    const updated = await db.select().from(promotions).where(eq(promotions.id, promotionId)).limit(1);
    expect(updated[0].discountPercent).toBe(25);
    expect(updated[0].isActive).toBe(false);

    await db.delete(promotions).where(eq(promotions.id, promotionId));
    const deleted = await db.select().from(promotions).where(eq(promotions.id, promotionId)).limit(1);
    expect(deleted).toHaveLength(0);
    promotionId = undefined;
  });

  afterAll(async () => {
    if (!db || !promotionId) return;
    const { promotions } = await import('../drizzle/schema');
    const { eq } = await import('drizzle-orm');
    await db.delete(promotions).where(eq(promotions.id, promotionId));
  });
});
