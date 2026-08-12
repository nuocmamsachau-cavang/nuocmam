import { getDb } from './server/db.js';
import { products } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  // Sử dụng các URL ảnh trực tiếp từ Picsum Photos / Wikimedia / Unsplash CDN ổn định trên mọi mobile browser
  const mobileImages = [
    'https://picsum.photos/seed/nuocmam1/800/800',
    'https://picsum.photos/seed/nuocmam2/800/800',
    'https://picsum.photos/seed/nuocmam3/800/800',
    'https://picsum.photos/seed/nuocmam4/800/800',
    'https://picsum.photos/seed/nuocmam5/800/800',
    'https://picsum.photos/seed/nuocmam6/800/800',
    'https://picsum.photos/seed/nuocmam7/800/800',
    'https://picsum.photos/seed/nuocmam8/800/800',
    'https://picsum.photos/seed/nuocmam9/800/800',
    'https://picsum.photos/seed/nuocmam10/800/800',
    'https://picsum.photos/seed/nuocmam11/800/800',
    'https://picsum.photos/seed/nuocmam12/800/800',
  ];

  const allProds = await db.select().from(products);
  for (let i = 0; i < allProds.length; i++) {
    const p = allProds[i];
    const newImg = mobileImages[i % mobileImages.length];
    await db.update(products)
      .set({ imageUrl: newImg })
      .where(eq(products.id, p.id));
    console.log(`✅ Updated mobile-safe image for product ID ${p.id}: ${newImg}`);
  }

  console.log('🎉 Đã cập nhật xong toàn bộ ảnh sản phẩm tối ưu mobile!');
}

main().catch(console.error);
