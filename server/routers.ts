import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getCategories, getCategoryById, getAllProducts, getProductById, getSeoMetadata, createOrder, getOrders, getAdminByUsername, getDb } from "./db";
import { hashPassword, verifyPassword, generateAdminToken } from "./auth";
import { categories, products, seoMetadata, orders, adminUsers } from "../drizzle/schema";
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
        return db.insert(orders).values(orderData);
      }),
  }),
});

export type AppRouter = typeof appRouter;
