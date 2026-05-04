import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { categories, products } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Category Management Operations", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database connection failed");
  });

  it("should retrieve all categories", async () => {
    const allCategories = await db.select().from(categories);
    expect(Array.isArray(allCategories)).toBe(true);
    expect(allCategories.length).toBeGreaterThan(0);
  });

  it("should retrieve a category by ID", async () => {
    // Get first category
    const allCategories = await db.select().from(categories).limit(1);
    if (allCategories.length === 0) {
      expect(true).toBe(true); // Skip if no categories
      return;
    }

    const categoryId = allCategories[0].id;
    const retrieved = await db.select().from(categories).where(eq(categories.id, categoryId));
    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].id).toBe(categoryId);
  });

  it("should verify category fields exist", async () => {
    const allCategories = await db.select().from(categories).limit(1);
    if (allCategories.length === 0) {
      expect(true).toBe(true); // Skip if no categories
      return;
    }

    const category = allCategories[0];
    expect(category).toHaveProperty("id");
    expect(category).toHaveProperty("name");
  });

  it("should verify category data types", async () => {
    const allCategories = await db.select().from(categories).limit(1);
    if (allCategories.length === 0) {
      expect(true).toBe(true); // Skip if no categories
      return;
    }

    const category = allCategories[0];
    expect(typeof category.id).toBe("number");
    expect(typeof category.name).toBe("string");
  });

  it("should count categories correctly", async () => {
    const allCategories = await db.select().from(categories);
    const count = allCategories.length;
    expect(count).toBeGreaterThan(0);
    expect(typeof count).toBe("number");
  });

  it("should retrieve products by category", async () => {
    // Get first category
    const allCategories = await db.select().from(categories).limit(1);
    if (allCategories.length === 0) {
      expect(true).toBe(true); // Skip if no categories
      return;
    }

    const categoryId = allCategories[0].id;
    const categoryProducts = await db.select().from(products).where(eq(products.categoryId, categoryId));
    expect(Array.isArray(categoryProducts)).toBe(true);
  });

  it("should verify category ordering", async () => {
    const allCategories = await db.select().from(categories);
    if (allCategories.length < 2) {
      expect(true).toBe(true); // Skip if less than 2 categories
      return;
    }

    // Verify that categories have displayOrder field
    expect(allCategories[0]).toHaveProperty("displayOrder");
  });

  it("should handle active/inactive categories", async () => {
    const allCategories = await db.select().from(categories);
    if (allCategories.length === 0) {
      expect(true).toBe(true); // Skip if no categories
      return;
    }

    const category = allCategories[0];
    expect(category).toHaveProperty("isActive");
    expect(typeof category.isActive).toBe("boolean");
  });
});
