import { getDb } from './server/db.js';
import { productImages, products } from './drizzle/schema.js';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }
  const imgs = await db.select().from(productImages);
  console.log('--- PRODUCT IMAGES ---');
  console.log(imgs);
  const prods = await db.select().from(products);
  console.log('--- PRODUCTS ---');
  console.log(prods.map(p => ({ id: p.id, name: p.name })));
}

main().catch(console.error);
