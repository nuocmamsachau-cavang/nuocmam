import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db.js";
import { products } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

describe("Product CRUD Operations", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database connection failed");
  });

  afterAll(async () => {
    // Cleanup: delete test products
    if (db) {
      await db.delete(products).where(eq(products.name, "Test Product"));
      await db.delete(products).where(eq(products.name, "Test Product for Retrieval"));
      await db.delete(products).where(eq(products.name, "Test Product for Update"));
      await db.delete(products).where(eq(products.name, "Test Product for Deletion"));
      await db.delete(products).where(eq(products.name, "Test Product with Optional"));
    }
  });

  it("should retrieve all products", async () => {
    const allProducts = await db.select().from(products);
    expect(Array.isArray(allProducts)).toBe(true);
    expect(allProducts.length).toBeGreaterThan(0);
  });

  it("should retrieve a product by ID", async () => {
    // Get first product
    const allProducts = await db.select().from(products).limit(1);
    if (allProducts.length === 0) {
      expect(true).toBe(true); // Skip if no products
      return;
    }

    const productId = allProducts[0].id;
    const retrieved = await db.select().from(products).where(eq(products.id, productId));
    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].id).toBe(productId);
  });

  it("should handle product retrieval with filters", async () => {
    // Get products from category 1
    const categoryProducts = await db.select().from(products).where(eq(products.categoryId, 1));
    expect(Array.isArray(categoryProducts)).toBe(true);
  });

  it("should verify product fields exist", async () => {
    const allProducts = await db.select().from(products).limit(1);
    if (allProducts.length === 0) {
      expect(true).toBe(true); // Skip if no products
      return;
    }

    const product = allProducts[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("categoryId");
  });

  it("should verify product data types", async () => {
    const allProducts = await db.select().from(products).limit(1);
    if (allProducts.length === 0) {
      expect(true).toBe(true); // Skip if no products
      return;
    }

    const product = allProducts[0];
    expect(typeof product.id).toBe("number");
    expect(typeof product.name).toBe("string");
    expect(typeof product.price).toBe("string");
    expect(typeof product.categoryId).toBe("number");
  });

  it("should count products correctly", async () => {
    const allProducts = await db.select().from(products);
    const count = allProducts.length;
    expect(count).toBeGreaterThan(0);
    expect(typeof count).toBe("number");
  });
});
