import { drizzle } from 'drizzle-orm/mysql2';
import { categories, products, adminUsers } from './drizzle/schema.js';
import crypto from 'crypto';

const db = drizzle(process.env.DATABASE_URL);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function seed() {
  console.log('🌱 Seeding database with categories, products, and admin user...\n');

  try {
    // 1. Create categories
    console.log('📂 Creating categories...');
    const categoryData = [
      { name: 'Cá Lục', slug: 'ca-luc', description: 'Nước mắm cá lục đậm đà, béo ngậy, giàu đạm', displayOrder: 1, isActive: true },
      { name: 'Cá Mực', slug: 'ca-muc', description: 'Nước mắm cá mực quý hiếm, sánh đặc như mật ong, hương vị độc đáo', displayOrder: 2, isActive: true },
      { name: 'Cá Cơm', slug: 'ca-com', description: 'Nước mắm cá cơm vị ngọt thanh, hương thơm dịu nhẹ', displayOrder: 3, isActive: true },
      { name: 'Mắm Tôm', slug: 'mam-tom', description: 'Mắm tôm Sa Châu mịn màng, thơm nồng đặc trưng', displayOrder: 4, isActive: true },
      { name: 'Cốt Đặc Biệt', slug: 'cot-dac-biet', description: 'Những sản phẩm cốt đặc biệt', displayOrder: 5, isActive: true },
      { name: 'Combo & Quà Tặng', slug: 'combo-qua-tang', description: 'Các bộ combo và quà tặng đặc biệt', displayOrder: 6, isActive: true },
      { name: 'Sản Phẩm Khác', slug: 'san-pham-khac', description: 'Các sản phẩm khác', displayOrder: 7, isActive: true },
    ];

    let categoryMap = {};
    for (const cat of categoryData) {
      try {
        const result = await db.insert(categories).values(cat);
        console.log(`  ✅ ${cat.name}`);
        categoryMap[cat.slug] = result.insertId || cat.slug;
      } catch (err) {
        console.log(`  ⚠️ ${cat.name} already exists`);
      }
    }

    // 2. Create admin user
    console.log('\n🔐 Creating admin user...');
    const adminPassword = hashPassword('nuocmamcavang123');
    try {
      await db.insert(adminUsers).values({
        username: 'GOSA',
        passwordHash: adminPassword,
        email: 'admin@nuocmamcavang.com',
        isActive: true,
      });
      console.log('  ✅ Admin user created (GOSA / nuocmamcavang123)');
    } catch (err) {
      console.log('  ⚠️ Admin user already exists');
    }

    // 3. Create sample products
    console.log('\n📦 Creating sample products...');
    
    // Get actual category IDs from database
    const allCategories = await db.select().from(categories);
    const catIdMap = {};
    allCategories.forEach(cat => {
      catIdMap[cat.slug] = cat.id;
    });

    const productData = [
      // Cá Lục
      {
        categoryId: catIdMap['ca-luc'],
        name: 'Nước Mắm Cá Lục Đặc Biệt 500ml',
        slug: 'nuoc-mam-ca-luc-dac-biet-500ml',
        description: 'Nước mắm cá lục ủ 18 tháng, đậm đà, béo ngậy, giàu đạm',
        price: 95000,
        displayOrder: 1,
        isActive: true,
      },
      {
        categoryId: catIdMap['ca-luc'],
        name: 'Nước Mắm Cá Lục Thượng Hạng 1L',
        slug: 'nuoc-mam-ca-luc-thuong-hang-1l',
        description: 'Nước mắm cá lục ủ 24 tháng, chất lượng cao',
        price: 180000,
        displayOrder: 2,
        isActive: true,
      },
      // Cá Mực
      {
        categoryId: catIdMap['ca-muc'],
        name: 'Nước Mắm Cá Mực Premium 500ml',
        slug: 'nuoc-mam-ca-muc-premium-500ml',
        description: 'Nước mắm cá mực quý hiếm, sánh đặc như mật ong, hương vị độc đáo',
        price: 150000,
        displayOrder: 1,
        isActive: true,
      },
      {
        categoryId: catIdMap['ca-muc'],
        name: 'Nước Mắm Cá Mực Cao Cấp 250ml',
        slug: 'nuoc-mam-ca-muc-cao-cap-250ml',
        description: 'Nước mắm cá mực cao cấp, ủ chín tự nhiên',
        price: 85000,
        displayOrder: 2,
        isActive: true,
      },
      // Cá Cơm
      {
        categoryId: catIdMap['ca-com'],
        name: 'Nước Mắm Cá Cơm Truyền Thống 500ml',
        slug: 'nuoc-mam-ca-com-truyen-thong-500ml',
        description: 'Nước mắm cá cơm vị ngọt thanh, hương thơm dịu nhẹ',
        price: 85000,
        displayOrder: 1,
        isActive: true,
      },
      {
        categoryId: catIdMap['ca-com'],
        name: 'Nước Mắm Cá Cơm Nguyên Chất 1L',
        slug: 'nuoc-mam-ca-com-nguyen-chat-1l',
        description: 'Nước mắm cá cơm nguyên chất, không pha chế',
        price: 160000,
        displayOrder: 2,
        isActive: true,
      },
      // Mắm Tôm
      {
        categoryId: catIdMap['mam-tom'],
        name: 'Mắm Tôm Sa Châu Nguyên Chất 250g',
        slug: 'mam-tom-sa-chau-nguyen-chat-250g',
        description: 'Mắm tôm xay mịn, ủ chín tự nhiên, không chất bảo quản',
        price: 55000,
        displayOrder: 1,
        isActive: true,
      },
      {
        categoryId: catIdMap['mam-tom'],
        name: 'Mắm Tôm Sa Châu Đặc Biệt 500g',
        slug: 'mam-tom-sa-chau-dac-biet-500g',
        description: 'Mắm tôm Sa Châu đặc biệt, chất lượng cao',
        price: 105000,
        displayOrder: 2,
        isActive: true,
      },
      // Cốt Đặc Biệt
      {
        categoryId: catIdMap['cot-dac-biet'],
        name: 'Cốt Nước Mắm Cá Vàng Đặc Biệt',
        slug: 'cot-nuoc-mam-ca-vang-dac-biet',
        description: 'Cốt nước mắm đặc biệt, dùng để pha chế',
        price: 120000,
        displayOrder: 1,
        isActive: true,
      },
      // Combo & Quà Tặng
      {
        categoryId: catIdMap['combo-qua-tang'],
        name: 'Combo Nước Mắm Cá Vàng Gia Đình',
        slug: 'combo-nuoc-mam-ca-vang-gia-dinh',
        description: 'Bộ combo 3 chai nước mắm khác nhau, phù hợp cho gia đình',
        price: 250000,
        displayOrder: 1,
        isActive: true,
      },
      {
        categoryId: catIdMap['combo-qua-tang'],
        name: 'Quà Tặng Nước Mắm Cá Vàng Sang Trọng',
        slug: 'qua-tang-nuoc-mam-ca-vang-sang-trong',
        description: 'Bộ quà tặng sang trọng, phù hợp cho dịp đặc biệt',
        price: 350000,
        displayOrder: 2,
        isActive: true,
      },
      // Sản Phẩm Khác
      {
        categoryId: catIdMap['san-pham-khac'],
        name: 'Nước Mắm Cá Vàng Hỗn Hợp 500ml',
        slug: 'nuoc-mam-ca-vang-hon-hop-500ml',
        description: 'Nước mắm hỗn hợp nhiều loại cá, vị hài hòa',
        price: 75000,
        displayOrder: 1,
        isActive: true,
      },
    ];

    for (const prod of productData) {
      try {
        await db.insert(products).values(prod);
        console.log(`  ✅ ${prod.name}`);
      } catch (err) {
        console.log(`  ⚠️ ${prod.name} already exists`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Categories: ${categoryData.length}`);
    console.log(`  - Products: ${productData.length}`);
    console.log(`  - Admin user: 1 (GOSA / nuocmamcavang123)`);
    console.log('\n✨ Ready to use! Access Admin Panel at: /admin\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
