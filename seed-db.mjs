import { drizzle } from 'drizzle-orm/mysql2';
import { categories, products, adminUsers } from './drizzle/schema.js';
import { hashPassword } from './server/auth.ts';
import crypto from 'crypto';

const db = drizzle(process.env.DATABASE_URL);

// Hash password helper
function hashPasswordSync(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create categories
    const categoryData = [
      { name: 'Cá Lục', slug: 'ca-luc', description: 'Nước mắm cá lục đậm đà, béo ngậy', displayOrder: 1 },
      { name: 'Cá Mực', slug: 'ca-muc', description: 'Nước mắm cá mực quý hiếm, hương vị độc đáo', displayOrder: 2 },
      { name: 'Cá Cơm', slug: 'ca-com', description: 'Nước mắm cá cơm vị ngọt thanh', displayOrder: 3 },
      { name: 'Mắm Tôm', slug: 'mam-tom', description: 'Mắm tôm Sa Châu mịn màng, thơm nồng', displayOrder: 4 },
      { name: 'Cốt Đặc Biệt', slug: 'cot-dac-biet', description: 'Những sản phẩm cốt đặc biệt', displayOrder: 5 },
      { name: 'Combo & Quà Tặng', slug: 'combo-qua-tang', description: 'Các bộ combo và quà tặng', displayOrder: 6 },
      { name: 'Sản Phẩm Khác', slug: 'san-pham-khac', description: 'Các sản phẩm khác', displayOrder: 7 },
    ];

    for (const cat of categoryData) {
      await db.insert(categories).values(cat).catch(() => {
        console.log(`Category ${cat.name} already exists`);
      });
    }

    console.log('✅ Categories created');

    // Create admin user
    const adminPassword = hashPasswordSync('nuocmamcavang123');
    await db.insert(adminUsers).values({
      username: 'GOSA',
      passwordHash: adminPassword,
      email: 'admin@nuocmamcavang.com',
      isActive: true,
    }).catch(() => {
      console.log('Admin user already exists');
    });

    console.log('✅ Admin user created (username: GOSA, password: nuocmamcavang123)');

    // Create sample products
    const productData = [
      {
        categoryId: 1,
        name: 'Nước Mắm Cá Lục Đặc Biệt',
        slug: 'nuoc-mam-ca-luc-dac-biet',
        description: 'Nước mắm cá lục ủ 18 tháng, đậm đà, béo ngậy',
        price: 95000,
        displayOrder: 1,
      },
      {
        categoryId: 2,
        name: 'Nước Mắm Cá Mực Premium',
        slug: 'nuoc-mam-ca-muc-premium',
        description: 'Nước mắm cá mực quý hiếm, sánh đặc như mật ong',
        price: 150000,
        displayOrder: 1,
      },
      {
        categoryId: 3,
        name: 'Nước Mắm Cá Cơm Truyền Thống',
        slug: 'nuoc-mam-ca-com-truyen-thong',
        description: 'Nước mắm cá cơm vị ngọt thanh, hương thơm dịu nhẹ',
        price: 85000,
        displayOrder: 1,
      },
      {
        categoryId: 4,
        name: 'Mắm Tôm Sa Châu Nguyên Chất',
        slug: 'mam-tom-sa-chau-nguyen-chat',
        description: 'Mắm tôm xay mịn, ủ chín tự nhiên',
        price: 55000,
        displayOrder: 1,
      },
    ];

    for (const prod of productData) {
      await db.insert(products).values(prod).catch(() => {
        console.log(`Product ${prod.name} already exists`);
      });
    }

    console.log('✅ Sample products created');
    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
