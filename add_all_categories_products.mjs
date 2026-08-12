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

  // Định nghĩa các sản phẩm mới chuẩn xác cho từng nhóm danh mục
  const additions = [
    // Nhóm 1: Hộp Quà Tặng Yêu Thương
    {
      catId: 1,
      items: [
        { name: 'Hộp Quà Sơn Mài Thượng Hạng 2 Chai Cốt Mắm', slug: 'hop-qua-son-mai-thuong-hang-2-chai', price: '450000', description: 'Hộp quà sơn mài cao cấp đựng 2 chai nước mắm cốt truyền thống Sa Châu Giao Thủy, món quà biếu sang trọng.' },
        { name: 'Giỏ Quà Tết Tinh Hoa Làng Nghề Sa Châu', slug: 'gio-qua-tet-tinh-hoa-lang-nghe', price: '320000', description: 'Giỏ quà kết hợp nước mắm cốt, mắm tôm đặc sản và gia vị truyền thống phục vụ mùa lễ tết.' }
      ]
    },
    // Nhóm 2: Nước Mắm Cá Mực
    {
      catId: 2,
      items: [
        { name: 'Nước Mắm Cá Mực Hảo Hạng 500ml', slug: 'nuoc-mam-ca-muc-hao-hang-500ml', price: '165000', description: 'Nước mắm cá mực đặc sản kết hợp mực tươi và cá cơm than ủ chượp ang sành phơi nắng.' },
        { name: 'Nước Mắm Cốt Mực Giao Thủy 330ml', slug: 'nuoc-mam-cot-muc-giao-thuy-330ml', price: '95000', description: 'Chai dung tích vừa, vị ngọt đậm đà từ mực biển Nam Định, thơm ngon tròn vị.' }
      ]
    },
    // Nhóm 3: Nước Mắm Cá Cơm
    {
      catId: 3,
      items: [
        { name: 'Nước Mắm Cá Cơm Than Đặc Biệt 750ml', slug: 'nuoc-mam-ca-com-than-dac-biet-750ml', price: '140000', description: 'Độ đạm tự nhiên cao, chắt lọc từ những con cá cơm than tươi ngon nhất vùng biển Giao Thủy.' },
        { name: 'Nước Mắm Cá Cơm Truyền Thống Chai Sành 500ml', slug: 'nuoc-mam-ca-com-truyen-thong-chai-sanh-500ml', price: '115000', description: 'Đựng trong chai sành thủ công giữ trọn hương vị mắm chắt truyền thống hơn 200 năm.' }
      ]
    },
    // Nhóm 4: Nước Mắm Truyền Thống
    {
      catId: 4,
      items: [
        { name: 'Mắm Tôm Cé Làng Gòi Hảo Hạng 500g', slug: 'mam-tom-ce-lang-goi-hao-hang-500g', price: '65000', description: 'Mắm tôm nguyên chất ủ chín kỹ lưỡng, hạt mịn thơm nức đặc sản danh tiếng Sa Châu.' },
        { name: 'Mắm Tép Chưng Thịt Truyền Thống 300g', slug: 'mam-tep-chung-thit-truyen-thong-300g', price: '85000', description: 'Mắm tép đồng nguyên chất thơm ngon, lý tưởng để làm món mắm tép chưng thịt đậm đà.' }
      ]
    },
    // Nhóm 5: Nước Mắm Cốt Đặc Biệt
    {
      catId: 5,
      items: [
        { name: 'Cốt Mắm Nhĩ Sa Châu Đặc Biệt 500ml', slug: 'cot-mam-nhi-sa-chau-dac-biet-500ml', price: '180000', description: 'Những giọt mắm nhĩ đầu tiên kéo rút trực tiếp từ ang sành phơi nắng, đạm cao vượt trội.' },
        { name: 'Nước Mắm Cốt Hạ Sình Thượng Hạng 1L', slug: 'nuoc-mam-cot-ha-sinh-thuong-hang-1l', price: '220000', description: 'Dòng nước mắm cốt lâu năm ủ chượp đặc biệt dành riêng cho người sành ăn.' }
      ]
    },
    // Nhóm 6: Combo & Quà Tặng
    {
      catId: 6,
      items: [
        { name: 'Combo Đak Lộc 3 Chai Nước Mắm Sa Châu', slug: 'combo-dak-loc-3-chai-nuoc-mam', price: '280000', description: 'Bộ 3 chai nước mắm truyền thống các dung tích phù hợp cho nhu cầu sử dụng đa dạng của gia đình.' },
        { name: 'Bộ Quà Tặng Tri Ân Khách Hàng 4 Chai', slug: 'bo-qua-tang-tri-an-4-chai', price: '420000', description: 'Bộ quà tặng cao cấp gồm 4 chai nước mắm cốt đặc sản Giao Thủy Nam Định.' }
      ]
    },
    // Nhóm 7: Sản Phẩm Khác
    {
      catId: 7,
      items: [
        { name: 'Muối Tôm Tây Ninh Đặc Sản Hũ 250g', slug: 'muoi-tom-tay-ninh-dac-san-250g', price: '35000', description: 'Muối tôm thơm ngon chất lượng dùng kèm trái cây hoặc chế biến món ăn.' },
        { name: 'Bột Canh Nấm Hương Tự Nhiên 400g', slug: 'bot-canh-nam-huong-tu-nhien-400g', price: '25000', description: 'Gia vị nêm nếm tự nhiên từ nấm hương ngọt thanh cho bữa cơm gia đình.' }
      ]
    }
  ];

  for (const group of additions) {
    for (const item of group.items) {
      const existing = await db.select().from(products).where(eq(products.slug, item.slug));
      if (existing.length > 0) {
        console.log(`ℹ️ Product already exists: ${item.name}`);
        continue;
      }

      await db.insert(products).values({
        categoryId: group.catId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        description: item.description,
        imageUrl: 'https://picsum.photos/seed/' + item.slug + '/800/800',
      });

      console.log(`✅ Added product: ${item.name} to category ID ${group.catId}`);
    }
  }

  console.log('🎉 Đã thêm thành công 2 sản phẩm mới cho từng nhóm danh mục còn lại!');
}

main().catch(console.error);
