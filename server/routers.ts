import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import { z } from "zod";
import { getCategories, getCategoryById, getAllProducts, getProductById, updateProduct, deleteProduct, createProduct, getSeoMetadata, createOrder, getOrders, getAdminByUsername, getDb, getPromotions, createPromotion, getEmailConfig, saveEmailConfig, getBlogPosts, getBlogPostBySlug, createBlogPost, getAllBlogPosts, getProductReviews, getApprovedReviews, createProductReview, getAllProductReviews, approveProductReview, getProductImages, getProductImageById, getBrandAssets, updateBrandAsset, createProductImage, updateProductImage, deleteProductImage, getSessionId, setSessionId, getLastDeploymentTime, setLastDeploymentTime } from "./db";
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
    create: publicProcedure
      .input(z.object({
        categoryId: z.number(),
        name: z.string(),
        slug: z.string(),
        description: z.string(),
        price: z.number(),
      }))
      .mutation(async ({ input }) => {
        return createProduct(input);
      }),
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
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return deleteProduct(input);
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
    getByProductId: publicProcedure.input(z.any()).query(({ input }) => {
      let productId = 1;
      if (typeof input === 'number') productId = input;
      else if (input && typeof input === 'object' && 'json' in input) productId = Number(input.json);
      else if (typeof input === 'string') productId = Number(input);
      return getProductImages(productId);
    }),
    getById: publicProcedure.input(z.number()).query(({ input }) => getProductImageById(input)),
    upload: publicProcedure
      .input(z.object({
        productId: z.number(),
        imageData: z.string(), // base64 or URL
        displayOrder: z.number().default(1),
        altText: z.string().optional(),
        title: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Validate max 3 images per product
          const existingImages = await getProductImages(input.productId);
          if (existingImages.length >= 3) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Maximum 3 images per product' });
          }

          // Convert base64 to buffer if needed
          let imageBuffer: Buffer;
          if (input.imageData.startsWith('data:image')) {
            const base64Data = input.imageData.split(',')[1];
            imageBuffer = Buffer.from(base64Data, 'base64');
          } else if (input.imageData.startsWith('http')) {
            // If it's a URL, fetch and convert
            const response = await fetch(input.imageData);
            imageBuffer = Buffer.from(await response.arrayBuffer());
          } else {
            imageBuffer = Buffer.from(input.imageData, 'base64');
          }

          // Upload to S3 with robust fallback to base64 data URL if S3/Forge fails
          let url = input.imageData;
          let key = `local-${Date.now()}`;
          try {
            const s3Result = await storagePut(
              `products/${input.productId}/image-${Date.now()}.jpg`,
              imageBuffer,
              'image/jpeg'
            );
            url = s3Result.url;
            key = s3Result.key;
          } catch (storageErr) {
            console.warn('⚠️ S3 storagePut failed, falling back to data URL:', storageErr);
            url = input.imageData;
          }

          // Save to database
          await createProductImage({
            productId: input.productId,
            imageUrl: url,
            imageKey: key,
            displayOrder: input.displayOrder,
            altText: input.altText,
            title: input.title,
          });

          // Also update the product's primary imageUrl so storefront reads it instantly
          const db = await getDb();
          if (db) {
            await db.update(products)
              .set({ imageUrl: url, imageKey: key })
              .where(eq(products.id, input.productId));
          }
          
          const images = await getProductImages(input.productId);
          const result = images[images.length - 1] || { productId: input.productId, imageUrl: url, imageKey: key, displayOrder: input.displayOrder, altText: input.altText, title: input.title, id: 0, createdAt: new Date() };
          
          // Trigger GitHub Actions webhook for auto-deployment
          try {
            const githubRepo = 'nuocmamsachau-cavang/nuocmam';
            const githubToken = process.env.GITHUB_TOKEN;
            if (!githubToken) {
              console.log('ℹ️ GITHUB_TOKEN not configured in environment, skipping automated GitHub dispatch.');
              return result;
            }
            
            const response = await fetch(
              `https://api.github.com/repos/${githubRepo}/dispatches`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${githubToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                  event_type: 'product_image_updated',
                  client_payload: {
                    productId: input.productId,
                    imageUrl: url,
                    timestamp: new Date().toISOString(),
                  }
                })
              }
            );

            if (response.ok) {
              console.log('✅ GitHub Actions triggered for deployment');
            } else {
              console.error('⚠️ Failed to trigger GitHub Actions:', response.status);
            }
          } catch (error) {
            console.error('⚠️ Error triggering GitHub Actions:', error);
          }
          
          return result;
        } catch (error) {
          console.error('Image upload error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to upload image to storage',
          });
        }
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        displayOrder: z.number().optional(),
        altText: z.string().optional(),
        title: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateProductImage(id, data);
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        // Get image first to check product
        const img = await getProductImageById(input);
        await deleteProductImage(input);
        if (img) {
          // Check remaining images for this product
          const remaining = await getProductImages(img.productId);
          const db = await getDb();
          if (db) {
            if (remaining.length > 0) {
              const primary = remaining[0];
              await db.update(products)
                .set({ imageUrl: primary.imageUrl, imageKey: primary.imageKey })
                .where(eq(products.id, img.productId));
            } else {
              await db.update(products)
                .set({ imageUrl: null, imageKey: null })
                .where(eq(products.id, img.productId));
            }
          }
        }
        return { success: true };
      }),
  }),

  settings: router({
    getSessionId: publicProcedure.query(async () => {
      const sessionId = await getSessionId();
      return { sessionId };
    }),
    setSessionId: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input }) => {
        await setSessionId(input.sessionId);
        return { success: true, sessionId: input.sessionId };
      }),
  }),

  brand: router({
    get: publicProcedure.query(async () => {
      return getBrandAssets();
    }),
    update: publicProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const allowedKeys = ['brand_mascot_logo', 'brand_horizontal_logo', 'brand_favicon', 'brand_hero_banner', 'brand_site_title'];
        if (!allowedKeys.includes(input.key)) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Tài sản thương hiệu không hợp lệ' });
        }
        if (input.value.startsWith('data:image')) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Ảnh tải lên phải dùng chức năng Tải Ảnh Lên để lưu storage URL ổn định' });
        }
        await updateBrandAsset(input.key, input.value, input.description);
        return { success: true };
      }),
    upload: publicProcedure
      .input(z.object({
        key: z.enum(['brand_mascot_logo', 'brand_horizontal_logo', 'brand_favicon', 'brand_hero_banner']),
        imageData: z.string().min(1),
        mimeType: z.string().default('image/jpeg'),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        let imageBuffer: Buffer;
        let contentType = input.mimeType;

        if (input.imageData.startsWith('data:')) {
          const match = input.imageData.match(/^data:([^;]+);base64,(.+)$/);
          if (!match) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Định dạng ảnh không hợp lệ' });
          }
          contentType = match[1];
          imageBuffer = Buffer.from(match[2], 'base64');
        } else {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Ảnh tải lên không hợp lệ' });
        }

        if (!contentType.startsWith('image/')) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Chỉ chấp nhận tệp hình ảnh' });
        }
        if (imageBuffer.length > 8 * 1024 * 1024) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Ảnh thương hiệu không được vượt quá 8MB' });
        }

        const extension = contentType.split('/')[1]?.replace('svg+xml', 'svg') || 'jpg';
        const uploaded = await storagePut(
          `brand/${input.key}-${Date.now()}.${extension}`,
          imageBuffer,
          contentType,
        );
        await updateBrandAsset(input.key, uploaded.url, input.description);
        return { success: true, url: uploaded.url, key: uploaded.key };
      }),
  }),
});
export type AppRouter = typeof appRouter;

