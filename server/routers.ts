import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";
import { getCategories, getCategoryById, getAllProducts, getProductById, getSeoMetadata, createOrder, getOrders, getAdminByUsername, getDb, getPromotions, createPromotion, getEmailConfig, saveEmailConfig } from "./db";
import { hashPassword, verifyPassword, generateAdminToken } from "./auth";
import { categories, products, seoMetadata, orders, adminUsers, promotions, emailConfig } from "../drizzle/schema";
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
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(() => getCategories()),
    getById: publicProcedure.input(z.number()).query(({ input }) => getCategoryById(input)),
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
});

export type AppRouter = typeof appRouter;
