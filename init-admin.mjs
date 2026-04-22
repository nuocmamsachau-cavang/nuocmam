import { drizzle } from 'drizzle-orm/mysql2';
import { adminUsers, categories } from './drizzle/schema.js';
import crypto from 'crypto';

const db = drizzle(process.env.DATABASE_URL);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function initAdmin() {
  console.log('🔐 Initializing admin user and categories...');

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
      try {
        await db.insert(categories).values(cat);
        console.log(`✅ Created category: ${cat.name}`);
      } catch (err) {
        console.log(`⚠️ Category ${cat.name} already exists`);
      }
    }

    // Create admin user
    const adminPassword = hashPassword('nuocmamcavang123');
    try {
      await db.insert(adminUsers).values({
        username: 'GOSA',
        passwordHash: adminPassword,
        email: 'admin@nuocmamcavang.com',
        isActive: true,
      });
      console.log('✅ Admin user created');
      console.log('📝 Username: GOSA');
      console.log('🔑 Password: nuocmamcavang123');
    } catch (err) {
      console.log('⚠️ Admin user already exists');
    }

    console.log('🎉 Initialization completed!');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

initAdmin();
