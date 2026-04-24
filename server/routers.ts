import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getCategories, getCategoryById, getAllProducts, getProductById, getSeoMetadata, createOrder, getOrders, getAdminByUsername, getDb } from "./db";
import { hashPassword, verifyPassword, generateAdminToken } from "./auth";
import { categories, products, seoMetadata, orders, adminUsers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { handleNewOrderNotifications } from "./order-notifications";
import { COOKIE_NAME } from "@shared/const";

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
        
        // Insert order into database
        const result = await db.insert(orders).values(orderData);
        
        // Send notifications asynchronously (don't wait for them)
        try {
          const notificationData = {
            orderNumber,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail,
            customerAddress: input.customerAddress,
            items: JSON.parse(input.items).map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: parseFloat(input.totalAmount),
          };
          
          await handleNewOrderNotifications(notificationData);
        } catch (notificationError) {
          // Log notification error but don't fail the order creation
          console.error('[Order Creation] Notification error (non-blocking):', notificationError);
        }
        
        return result;
      }),
    list: publicProcedure.query(() => getOrders()),
  }),
});

export type AppRouter = typeof appRouter;
