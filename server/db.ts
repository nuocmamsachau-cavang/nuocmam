import { eq, desc, asc, sql, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, categories, products, seoMetadata, orders, adminUsers, promotions, emailConfig, blogPosts, productReviews, productImages, ProductImage, websiteSettings, WebsiteSetting } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product & Category Queries
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.displayOrder));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products)
    .where(eq(products.categoryId, categoryId))
    .orderBy(asc(products.displayOrder));
}

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.displayOrder));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// SEO Queries
export async function getSeoMetadata(pageType: string, pageId?: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(seoMetadata)
    .where(eq(seoMetadata.pageType, pageType as any))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// Order Queries
export async function createOrder(order: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(orders).values(order);
}

export async function getOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

// Admin User Queries
export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Promotion Queries
export async function getPromotions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(promotions).orderBy(desc(promotions.createdAt));
}

export async function createPromotion(promo: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(promotions).values(promo);
}

export async function getPromotionByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(promotions)
    .where(eq(promotions.code, code))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// Email Config Queries
export async function getEmailConfig() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(emailConfig).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function saveEmailConfig(config: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getEmailConfig();
  if (existing) {
    return db.update(emailConfig).set(config).where(eq(emailConfig.id, existing.id));
  } else {
    return db.insert(emailConfig).values(config);
  }
}

// Blog Posts Queries
export async function getBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createBlogPost(post: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(blogPosts).values(post);
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

// Product Reviews Queries
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productReviews)
    .where(eq(productReviews.productId, productId))
    .orderBy(desc(productReviews.createdAt));
}

export async function getApprovedReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productReviews)
    .where(eq(productReviews.productId, productId))
    .orderBy(desc(productReviews.createdAt));
}

export async function createProductReview(review: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(productReviews).values(review);
}

export async function getAllProductReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productReviews).orderBy(desc(productReviews.createdAt));
}

export async function approveProductReview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(productReviews).set({ isApproved: true }).where(eq(productReviews.id, id));
}

// Product Images Queries
export async function getProductImages(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.displayOrder));
}

export async function getProductImageById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(productImages).where(eq(productImages.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createProductImage(image: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(productImages).values(image);
  return result;
}

export async function updateProductImage(id: number, image: Partial<ProductImage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(productImages).set(image).where(eq(productImages.id, id));
}

export async function deleteProductImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(productImages).where(eq(productImages.id, id));
}

export async function updateProduct(id: number, data: {
  categoryId?: number;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const updateData: any = {};
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  
  await db.update(products).set(updateData).where(eq(products.id, id));
  return getProductById(id);
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Delete product images first
  await db.delete(productImages).where(eq(productImages.productId, id));
  
  // Delete product
  await db.delete(products).where(eq(products.id, id));
  
  return { success: true };
}

export async function createProduct(data: {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  price: number | string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const priceValue = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
  
  await db.insert(products).values({
    categoryId: data.categoryId,
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: priceValue as any,
  });
  
  // Get the newly created product by slug
  const result = await db.select().from(products).where(eq(products.slug, data.slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}


// Website Settings Queries
export async function getWebsiteSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(websiteSettings).where(eq(websiteSettings.key, key)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function setWebsiteSetting(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getWebsiteSetting(key);
  if (existing) {
    return db.update(websiteSettings).set({ value, description }).where(eq(websiteSettings.key, key));
  } else {
    return db.insert(websiteSettings).values({ key, value, description });
  }
}

export async function getSessionId() {
  const setting = await getWebsiteSetting('sessionId');
  return setting?.value || null;
}

export async function setSessionId(sessionId: string) {
  return setWebsiteSetting('sessionId', sessionId, 'Manus session ID for website deployment');
}

export async function getLastDeploymentTime() {
  const setting = await getWebsiteSetting('lastDeploymentTime');
  return setting?.value ? new Date(setting.value) : null;
}

export async function setLastDeploymentTime() {
  return setWebsiteSetting('lastDeploymentTime', new Date().toISOString(), 'Last successful deployment timestamp');
}

// Brand Assets & Media Helpers
export async function getBrandAssets() {
  const db = await getDb();
  if (!db) return {};
  const settings = await db.select().from(websiteSettings).where(like(websiteSettings.key, 'brand_%'));
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return result;
}

export async function updateBrandAsset(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(websiteSettings).where(eq(websiteSettings.key, key)).limit(1);
  if (existing.length > 0) {
    return db.update(websiteSettings).set({ value, description: description || existing[0].description }).where(eq(websiteSettings.key, key));
  } else {
    return db.insert(websiteSettings).values({ key, value, description: description || 'Brand asset' });
  }
}
