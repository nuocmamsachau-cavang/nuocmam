import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from './db';
import { productImages, products } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Product Images Management', () => {
  let db: any;
  let testProductId: number;
  let testImageId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      console.warn('Database not available for product images tests');
    }
  });

  it('should create a product image', async () => {
    if (!db) {
      console.warn('Skipping test: database not available');
      return;
    }

    // Get first product or create test product
    const prods = await db.select().from(products).limit(1);
    if (prods.length === 0) {
      console.warn('No products found in database');
      return;
    }

    testProductId = prods[0].id;

    const testImage = {
      productId: testProductId,
      imageUrl: 'https://example.com/test-image-1.jpg',
      imageKey: 'test-image-1',
      displayOrder: 1,
      altText: 'Test Product Image 1',
      title: 'Test Image 1',
    };

    const result = await db.insert(productImages).values(testImage);
    expect(result).toBeDefined();

    // Get the inserted image
    const inserted = await db.select().from(productImages)
      .where(eq(productImages.productId, testProductId))
      .limit(1);
    
    if (inserted.length > 0) {
      testImageId = inserted[0].id;
      expect(inserted[0].altText).toBe('Test Product Image 1');
    }
  });

  it('should retrieve product images by product ID', async () => {
    if (!db || !testProductId) {
      console.warn('Skipping test: database not available or no test product');
      return;
    }

    const result = await db.select().from(productImages)
      .where(eq(productImages.productId, testProductId));
    
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].productId).toBe(testProductId);
  });

  it('should update product image metadata', async () => {
    if (!db || !testImageId) {
      console.warn('Skipping test: database not available or no test image');
      return;
    }

    await db.update(productImages).set({
      altText: 'Updated Alt Text',
      displayOrder: 2,
    }).where(eq(productImages.id, testImageId));

    const result = await db.select().from(productImages)
      .where(eq(productImages.id, testImageId))
      .limit(1);

    expect(result[0].altText).toBe('Updated Alt Text');
    expect(result[0].displayOrder).toBe(2);
  });

  it('should support up to 3 images per product', async () => {
    if (!db || !testProductId) {
      console.warn('Skipping test: database not available or no test product');
      return;
    }

    // Add second and third images
    const image2 = {
      productId: testProductId,
      imageUrl: 'https://example.com/test-image-2.jpg',
      imageKey: 'test-image-2',
      displayOrder: 2,
      altText: 'Test Product Image 2',
    };

    const image3 = {
      productId: testProductId,
      imageUrl: 'https://example.com/test-image-3.jpg',
      imageKey: 'test-image-3',
      displayOrder: 3,
      altText: 'Test Product Image 3',
    };

    await db.insert(productImages).values(image2);
    await db.insert(productImages).values(image3);

    const result = await db.select().from(productImages)
      .where(eq(productImages.productId, testProductId));

    expect(result.length).toBe(3);
  });

  it('should delete product image', async () => {
    if (!db || !testImageId) {
      console.warn('Skipping test: database not available or no test image');
      return;
    }

    await db.delete(productImages).where(eq(productImages.id, testImageId));

    const result = await db.select().from(productImages)
      .where(eq(productImages.id, testImageId));

    expect(result.length).toBe(0);
  });

  afterAll(async () => {
    // Cleanup test data
    if (db && testProductId) {
      try {
        await db.delete(productImages).where(eq(productImages.productId, testProductId));
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
});
