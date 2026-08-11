import { getDb } from './server/db.js';
import { products, productImages } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  // Lấy toàn bộ ảnh từ bảng productImages
  const imgs = await db.select().from(productImages);
  console.log('Found product images:', imgs.length);

  for (const img of imgs) {
    if (img.displayOrder === 1 || !img.displayOrder) {
      // Cập nhật trực tiếp imageUrl vào bảng products để trang chủ render ngay lập tức không cần join phức tạp
      await db.update(products)
        .set({ imageUrl: img.imageUrl, imageKey: img.imageKey })
        .where(eq(products.id, img.productId));
      console.log(`Updated product ${img.productId} with image ${img.imageUrl}`);
    }
  }

  // Nếu sản phẩm nào chưa có trong productImages nhưng có ảnh mẫu, cập nhật luôn cho tất cả các sản phẩm
  const allProds = await db.select().from(products);
  const sampleUrls = [
    'https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
  ];

  for (let i = 0; i < allProds.length; i++) {
    const prod = allProds[i];
    if (!prod.imageUrl) {
      const url = sampleUrls[i % sampleUrls.length];
      await db.update(products)
        .set({ imageUrl: url })
        .where(eq(products.id, prod.id));
      console.log(`Assigned default sample image to product ID ${prod.id}: ${prod.name}`);
    }
  }

  console.log('✅ Đã đồng bộ hoàn tất ảnh sản phẩm vào bảng products!');
}

main().catch(console.error);
