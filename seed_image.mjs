import { getDb } from './server/db.js';
import { productImages } from './drizzle/schema.js';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  // Thêm ảnh mẫu chuẩn cho sản phẩm ID 1 (Nước Mắm Cá Nục Đặc Biệt 500ml)
  const sampleImage = {
    productId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80',
    imageKey: 'sample-fish-sauce-1',
    displayOrder: 1,
    altText: 'Nước Mắm Cá Nục Đặc Biệt Sa Châu 500ml',
    title: 'Nước Mắm Cá Nục Đặc Biệt',
  };

  await db.insert(productImages).values(sampleImage);
  console.log('✅ Đã thêm ảnh mẫu thành công cho sản phẩm ID 1!');
}

main().catch(console.error);
