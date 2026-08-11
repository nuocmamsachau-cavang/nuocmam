import { getDb } from './server/db.js';
import { products } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  // Danh sách sản phẩm chuẩn xác theo di sản làng nghề nước mắm Sa Châu, Giao Thủy, Nam Định
  const productUpdates = [
    {
      id: 1,
      name: 'Nước Mắm Cá Nục Đặc Biệt 500ml',
      description: 'Nước mắm cá nục Sa Châu (Giao Thủy, Nam Định) ủ chượp truyền thống hơn 200 năm trong ang sành phơi nắng, đậm đà, giàu đạm tự nhiên.',
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80',
    },
    {
      id: 2,
      name: 'Nước Mắm Cá Nục Thượng Hạng 1L',
      description: 'Nước mắm cốt cá nục Sa Châu thượng hạng dung tích 1L, chắt lọc tinh túy từ phương pháp ăn sương nằm nắng truyền thống.',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    },
    {
      id: 3,
      name: 'Nước Mắm Cá Mực Premium 500ml',
      description: 'Nước mắm cá mực Sa Châu premium quý hiếm, sánh đặc tự nhiên, hương vị đậm đà đặc trưng của làng nghề ven biển Nam Định.',
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    },
    {
      id: 4,
      name: 'Nước Mắm Cá Mực Cao Cấp 250ml',
      description: 'Nước mắm cá mực Sa Châu cao cấp chai 250ml, ủ chín tự nhiên từ mực tươi, mang lại hương vị thơm ngon độc đáo.',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    },
    {
      id: 5,
      name: 'Nước Mắm Cá Cơm Truyền Thống 500ml',
      description: 'Nước mắm cá cơm Sa Châu (Giao Thủy, Nam Định) vị ngọt thanh, hương thơm dịu nhẹ, giữ trọn vẹn hương vị truyền thống 2 thế kỷ.',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    },
    {
      id: 6,
      name: 'Nước Mắm Cá Cơm Nguyên Chất 1L',
      description: 'Nước mắm cá cơm nguyên chất Sa Châu 1L, kết tinh từ cá cơm tươi và muối biển sạch qua quy trình phơi nắng ang sành nghiêm ngặt.',
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80',
    },
    {
      id: 7,
      name: 'Mắm Tôm Sa Châu Nguyên Chất 250g',
      description: 'Mắm tôm Sa Châu (Giao Thủy, Nam Định) nguyên chất xay mịn, ủ chín tự nhiên thơm lừng, đặc sản nức tiếng vùng Nam Định.',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    },
    {
      id: 8,
      name: 'Mắm Tôm Sa Châu Đặc Biệt 500g',
      description: 'Mắm tôm Sa Châu đặc biệt hũ 500g chất lượng cao, chuẩn vị gia truyền làng nghề Gòi, phục vụ bún đậu và ẩm thực truyền thống.',
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    },
    {
      id: 9,
      name: 'Cốt Nước Mắm Cá Vàng Đặc Biệt',
      description: 'Cốt nước mắm đặc biệt làng nghề Sa Châu, Giao Thủy, Nam Định, độ đạm cao tự nhiên dùng để nêm nếm hoặc làm quà biếu.',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    },
    {
      id: 10,
      name: 'Combo Nước Mắm Cá Vàng Gia Đình',
      description: 'Bộ combo 3 chai nước mắm truyền thống Sa Châu Giao Thủy, sự kết hợp hoàn hảo cho bữa cơm ấm cúng của mọi gia đình Việt.',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    },
    {
      id: 11,
      name: 'Quà Tặng Nước Mắm Cá Vàng Sang Trọng',
      description: 'Hộp quà tặng nước mắm cốt Sa Châu sang trọng, tinh tế, lưu giữ tinh hoa ẩm thực truyền thống hơn 200 năm.',
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80',
    },
    {
      id: 12,
      name: 'Nước Mắm Cá Vàng Hỗn Hợp 500ml',
      description: 'Nước mắm truyền thống hỗn hợp cá tuyển chọn từ làng nghề Sa Châu, Giao Thủy, Nam Định, vị hài hòa dễ sử dụng.',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    },
  ];

  for (const item of productUpdates) {
    await db.update(products)
      .set({
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
      })
      .where(eq(products.id, item.id));
    console.log(`✅ Updated product ID ${item.id}: ${item.name}`);
  }

  console.log('🎉 Đã cập nhật xong toàn bộ mô tả chuẩn xác theo di sản làng nghề Sa Châu, Giao Thủy, Nam Định!');
}

main().catch(console.error);
