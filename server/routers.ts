import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";
import { getCategories, getCategoryById, getAllProducts, getProductById, updateProduct, getSeoMetadata, createOrder, getOrders, getAdminByUsername, getDb, getPromotions, createPromotion, getEmailConfig, saveEmailConfig, getBlogPosts, getBlogPostBySlug, createBlogPost, getAllBlogPosts, getProductReviews, getApprovedReviews, createProductReview, getAllProductReviews, approveProductReview, getProductImages, getProductImageById, createProductImage, updateProductImage, deleteProductImage } from "./db";
import { hashPassword, verifyPassword, generateAdminToken } from "./auth";
import { categories, products, seoMetadata, orders, adminUsers, promotions, emailConfig, blogPosts, productReviews, productImages } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Admin Authentication
  admin: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input }) => {
        const admin = await getAdminByUsername(input.username);
        if (!admin || !verifyPassword(input.password, admin.passwordHash)) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }
        
        const token = generateAdminToken(admin.id);
        return { token, admin: { id: admin.id, username: admin.username, email: admin.email } };
      }),
  }),

  // Products
  products: router({
    list: publicProcedure.query(() => getAllProducts()),
    getById: publicProcedure.input(z.number()).query(({ input }) => getProductById(input)),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        categoryId: z.number().optional(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(() => getCategories()),
    getById: publicProcedure.input(z.number()).query(({ input }) => getCategoryById(input)),
    create: publicProcedure
      .input(z.object({ name: z.string(), slug: z.string(), description: z.string().optional(), displayOrder: z.number().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db.insert(categories).values({
          name: input.name,
          slug: input.slug,
          description: input.description || '',
          displayOrder: input.displayOrder || 0,
        });
        return { success: true, ...input };
      }),
    update: publicProcedure
      .input(z.object({ id: z.number(), name: z.string(), slug: z.string(), description: z.string().optional(), displayOrder: z.number().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db.update(categories).set({
          name: input.name,
          slug: input.slug,
          description: input.description || '',
          displayOrder: input.displayOrder || 0,
        }).where(eq(categories.id, input.id));
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        await db.delete(categories).where(eq(categories.id, input));
        return { success: true };
      }),
  }),

  // SEO Management
  seo: router({
    get: publicProcedure
      .input(z.object({ pageType: z.string(), pageId: z.number().optional() }))
      .query(({ input }) => getSeoMetadata(input.pageType, input.pageId)),
  }),

  // Orders
  orders: router({
    list: publicProcedure.query(() => getOrders()),
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerPhone: z.string(),
        customerEmail: z.string().optional(),
        customerAddress: z.string(),
        items: z.string(),
        totalAmount: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        
        const orderNumber = `ORD-${Date.now()}`;
        const orderData: any = {
          orderNumber,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail || null,
          customerAddress: input.customerAddress,
          items: input.items,
          totalAmount: input.totalAmount,
          notes: input.notes || null,
        };
        
        const result = await db.insert(orders).values(orderData);
        
        // Send owner notification
        try {
          await notifyOwner({
            title: `📦 Đơn hàng mới từ ${input.customerName}`,
            content: `Đơn hàng: ${orderNumber}\nSố điện thoại: ${input.customerPhone}\nĐịa chỉ: ${input.customerAddress}\nTổng tiền: ${input.totalAmount}`,
          });
        } catch (err) {
          console.error('Failed to send owner notification:', err);
        }
        
        return result;
      }),
  }),

  // Promotions
  promotions: router({
    list: publicProcedure.query(() => getPromotions()),
    create: publicProcedure
      .input(z.object({
        code: z.string(),
        discountPercent: z.number(),
        startDate: z.date(),
        endDate: z.date(),
        description: z.string().optional(),
        maxUsage: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return createPromotion({
          code: input.code,
          discountPercent: input.discountPercent,
          startDate: input.startDate,
          endDate: input.endDate,
          description: input.description,
          maxUsage: input.maxUsage,
          isActive: true,
        });
      }),
  }),

  // Email Configuration
  email: router({
    getConfig: publicProcedure.query(() => getEmailConfig()),
    saveConfig: publicProcedure
      .input(z.object({
        smtpServer: z.string(),
        smtpPort: z.number(),
        smtpUser: z.string(),
        smtpPassword: z.string(),
        fromEmail: z.string().email(),
        toEmail: z.string().email(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return saveEmailConfig(input);
      }),
  }),

  // Analytics
  analytics: router({
    getDashboard: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return null;
      
      const allOrders = await getOrders();
      const totalOrders = allOrders.length;
      const totalRevenue = allOrders.reduce((sum: number, order: any) => {
        const amount = parseFloat(order.totalAmount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      const recentOrders = allOrders.slice(0, 5);
      
      return {
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        recentOrders,
        stats: {
          pending: allOrders.filter((o: any) => o.status === 'pending').length,
          confirmed: allOrders.filter((o: any) => o.status === 'confirmed').length,
          shipped: allOrders.filter((o: any) => o.status === 'shipped').length,
          delivered: allOrders.filter((o: any) => o.status === 'delivered').length,
        }
      };
    }),
  }),

  // Blog Posts
  blog: router({
    list: publicProcedure.query(() => getBlogPosts()),
    getBySlug: publicProcedure.input(z.string()).query(({ input }) => getBlogPostBySlug(input)),
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        excerpt: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        author: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createBlogPost(input);
      }),
    getAll: publicProcedure.query(() => getAllBlogPosts()),
  }),

  // Domain Management
  domain: router({
    activateSSL: publicProcedure
      .input(z.object({ domain: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
          const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
          
          if (!forgeUrl || !forgeKey) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'API configuration missing' });
          }
          
          const response = await fetch(`${forgeUrl}/domains/activate-ssl`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${forgeKey}`,
            },
            body: JSON.stringify({ domain: input.domain }),
          });
          
          if (!response.ok) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to activate SSL certificate' });
          }
          
          const data = await response.json();
          return { success: true, message: 'SSL certificate activation initiated', data };
        } catch (error) {
          console.error('SSL activation error:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to activate SSL certificate' });
        }
      }),
  }),
  // Product Reviews
  reviews: router({
    getByProduct: publicProcedure.input(z.number()).query(({ input }) => getProductReviews(input)),
    getApproved: publicProcedure.input(z.number()).query(({ input }) => getApprovedReviews(input)),
    create: publicProcedure
      .input(z.object({
        productId: z.number(),
        customerName: z.string(),
        customerEmail: z.string().email().optional(),
        rating: z.number().min(1).max(5),
        title: z.string(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        return createProductReview({
          ...input,
          isApproved: false,
        });
      }),
    getAll: publicProcedure.query(() => getAllProductReviews()),
    approve: publicProcedure.input(z.number()).mutation(({ input }) => approveProductReview(input)),
  }),

  // Product Images
  productImages: router({
    getByProductId: publicProcedure.input(z.number()).query(({ input }) => getProductImages(input)),
    getById: publicProcedure.input(z.number()).query(({ input }) => getProductImageById(input)),
    upload: publicProcedure
      .input(z.object({
        productId: z.number(),
        imageUrl: z.string(),
        imageKey: z.string(),
        displayOrder: z.number().default(1),
        altText: z.string().optional(),
        title: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Validate max 3 images per product
        const existingImages = await getProductImages(input.productId);
        if (existingImages.length >= 3) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Maximum 3 images per product' });
        }
        
        await createProductImage(input);
        const images = await getProductImages(input.productId);
        return images[images.length - 1] || { ...input, id: 0 };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        displayOrder: z.number().optional(),
        altText: z.string().optional(),
        title: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await updateProductImage(id, updateData);
        return getProductImageById(id);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await deleteProductImage(input);
        return { success: true };
      }),
  }),});

export type AppRouter = typeof appRouter;
