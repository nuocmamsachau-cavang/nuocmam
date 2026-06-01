import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from './db';
import { categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Category CRUD Integration Tests', () => {
  let db: any;
  let testCategoryId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      console.warn('Database not available for category integration tests');
    }
  });

  it('should create a category', async () => {
    if (!db) {
      console.warn('Skipping test: database not available');
      return;
    }

    const testCategory = {
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test category description',
      displayOrder: 99,
      isActive: true,
    };

    const result = await db.insert(categories).values(testCategory);
    expect(result).toBeDefined();
    
    // Store ID for later tests
    const inserted = await db.select().from(categories).where(eq(categories.slug, 'test-category')).limit(1);
    if (inserted.length > 0) {
      testCategoryId = inserted[0].id;
    }
  });

  it('should read a category by ID', async () => {
    if (!db || !testCategoryId) {
      console.warn('Skipping test: database not available or no test category');
      return;
    }

    const result = await db.select().from(categories).where(eq(categories.id, testCategoryId)).limit(1);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Test Category');
  });

  it('should update a category', async () => {
    if (!db || !testCategoryId) {
      console.warn('Skipping test: database not available or no test category');
      return;
    }

    await db.update(categories).set({
      name: 'Updated Test Category',
      description: 'Updated description',
    }).where(eq(categories.id, testCategoryId));

    const result = await db.select().from(categories).where(eq(categories.id, testCategoryId)).limit(1);
    expect(result[0].name).toBe('Updated Test Category');
    expect(result[0].description).toBe('Updated description');
  });

  it('should delete a category', async () => {
    if (!db || !testCategoryId) {
      console.warn('Skipping test: database not available or no test category');
      return;
    }

    await db.delete(categories).where(eq(categories.id, testCategoryId));

    const result = await db.select().from(categories).where(eq(categories.id, testCategoryId)).limit(1);
    expect(result.length).toBe(0);
  });

  afterAll(async () => {
    // Cleanup any remaining test data
    if (db && testCategoryId) {
      try {
        await db.delete(categories).where(eq(categories.id, testCategoryId));
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
});
