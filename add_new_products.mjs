import { getDb } from './server/db.js';
import { products, categories } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  const cats = await db.select().from(categories);
  console.log('Categories found:', cats.map(c => ({ id: c.id, name: c.name })));

  // Map các tên nhóm hiện có: 
  // 'Hộp Quà Tặng Yêu Thương' (id 1)
  // 'Nước Mắm Cá Mực' (id 2)
  // 'Nước Mắm Cá Cơm' (id 3)
  // 'Nước Mắm Truyền Thống' (id 4)
  const targetCat = cats[0] || cats[2] || cats[1];
  if (!targetCat) {
    console.log('No category found');
    return;
  }

  const newProductsData = [
    { name: 'Nước Mắm Cốt Đặc Biệt Giao Thủy 750ml', slug: 'nuoc-mam-cot-dac-biet-750ml', price: '160000', description: 'Nước mắm cốt đặc biệt ủ chượp thủ công tại làng nghề Sa Châu, Nam Định.' },
    { name: 'Nước Mắm Truyền Thống Hạng Nhất 500ml', slug: 'nuoc-mam-truyen-thong-hang-nhat-500ml', price: '120000', description: 'Hương vị nước mắm chắt nguyên chất đậm đà truyền thống hơn 200 năm.' },
  ];

  for (const item of newProductsData) {
    const existing = await db.select().from(products).where(eq(products.slug, item.slug));
    if (existing.length > 0) {
      console.log(`ℹ️ Product already exists: ${item.name}`);
      continue;
    }

    await db.insert(products).values({
      categoryId: targetCat.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      description: item.description,
      imageUrl: 'https://picsum.photos/seed/' + item.slug + '/800/800',
    });

    console.log(`✅ Created new product: ${item.name} under category ${targetCat.name}`);
  }

  console.log('🎉 Đã thêm thành công các sản phẩm mới!');
}

main().catch(console.error);
