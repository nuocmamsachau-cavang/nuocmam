import { getDb } from './server/db.js';
import { products } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  // Danh sách ảnh trực tiếp cực kỳ ổn định (Direct image links)
  const directImages = [
    'https://images.unsplash.com/photo-1598514982205-f36804f32e98',
    'https://images.unsplash.com/photo-1544025162-d76694265947',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    'https://images.unsplash.com/photo-1598514982205-f36804f32e98',
    'https://images.unsplash.com/photo-1544025162-d76694265947',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    'https://images.unsplash.com/photo-1598514982205-f36804f32e98',
    'https://images.unsplash.com/photo-1544025162-d76694265947',
  ];

  const allProds = await db.select().from(products);
  for (let i = 0; i < allProds.length; i++) {
    const p = allProds[i];
    const newImg = directImages[i % directImages.length];
    await db.update(products)
      .set({ imageUrl: newImg })
      .where(eq(products.id, p.id));
    console.log(`✅ Fixed image for product ID ${p.id}: ${newImg}`);
  }

  console.log('🎉 Đã cập nhật toàn bộ URL ảnh sản phẩm thành công!');
}

main().catch(console.error);
