import { getDb } from './server/db';
import { products, productImages } from './drizzle/schema';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }
  const prods = await db.select().from(products);
  const imgs = await db.select().from(productImages);
  console.log('--- PRODUCTS ---', prods.length);
  prods.forEach(p => console.log(`ID: ${p.id} | Name: ${p.name} | imageUrl: ${p.imageUrl}`));
  console.log('--- PRODUCT IMAGES ---', imgs.length);
  imgs.forEach(i => console.log(`ID: ${i.id} | ProductID: ${i.productId} | imageUrl: ${i.imageUrl} | key: ${i.imageKey}`));
}

main().catch(console.error);
