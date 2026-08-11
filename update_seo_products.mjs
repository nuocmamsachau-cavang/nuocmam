import { getDb } from './server/db.js';
import { products } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  // Danh sách sản phẩm chuẩn SEO theo đúng tên và đặc trưng nguyên liệu
  const productUpdates = [
    {
      id: 1,
      name: 'Nước Mắm Cá Nục Đặc Biệt 500ml',
      description: 'Nước mắm cá nục Sa Châu đặc biệt ủ chượp tự nhiên 18 tháng, đậm đà, béo ngậy, giàu đạm tự nhiên.',
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80',
    },
    {
      id: 2,
      name: 'Nước Mắm Cá Nục Thượng Hạng 1L',
      description: 'Nước mắm cốt cá nục Sa Châu thượng hạng ủ chượp 24 tháng trong lu sành, chuẩn vị truyền thống 200 năm.',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    },
    {
      id: 3,
      name: 'Nước Mắm Cá Mực Premium 500ml',
      description: 'Nước mắm cá mực Sa Châu premium quý hiếm, sánh đặc như mật ong, hương vị đậm đà độc đáo.',
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    },
    {
      id: 4,
      name: 'Nước Mắm Cá Mực Cao Cấp 250ml',
      description: 'Nước mắm cá mực Sa Châu cao cấp chai nhỏ tiện lợi, ủ chín tự nhiên từ mực tươi nguyên chất.',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    },
    {
      id: 5,
      name: 'Nước Mắm Cá Cơm Truyền Thống 500ml',
      description: 'Nước mắm cá cơm Sa Châu truyền thống vị ngọt thanh, hương thơm dịu nhẹ, không chất bảo quản.',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    },
    {
      id: 6,
      name: 'Nước Mắm Cá Cơm Nguyên Chất 1L',
      description: 'Nước mắm cá cơm Sa Châu nguyên chất dung tích lớn 1L, chắt cốt đậm đà từ muối biển và cá cơm than.',
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80',
    },
    {
      id: 7,
      name: 'Mắm Tôm Sa Châu Nguyên Chất 250g',
      description: 'Mắm tôm Sa Châu nguyên chất xay mịn, ủ chín tự nhiên thơm lừng, đặc sản truyền thống Nam Định.',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    },
    {
      id: 8,
      name: 'Mắm Tôm Sa Châu Đặc Biệt 500g',
      description: 'Mắm tôm Sa Châu đặc biệt hũ 500g chất lượng cao, chuẩn vị gia truyền dùng cho bún đậu và chế biến món ăn.',
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    },
    {
      id: 9,
      name: 'Cốt Nước Mắm Cá Vàng Đặc Biệt',
      description: 'Cốt nước mắm đặc biệt làng nghề Sa Châu, độ đạm cao dùng để nêm nếm hoặc pha chế nước chấm hảo hạng.',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    },
    {
      id: 10,
      name: 'Combo Nước Mắm Cá Vàng Gia Đình',
      description: 'Bộ combo 3 chai nước mắm truyền thống Sa Châu khác nhau, lựa chọn hoàn hảo cho bữa cơm gia đình.',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    },
    {
      id: 11,
      name: 'Quà Tặng Nước Mắm Cá Vàng Sang Trọng',
      description: 'Hộp quà tặng nước mắm Sa Châu sang trọng, cao cấp, món quà ý nghĩa tri ân đối tác và người thân.',
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80',
    },
    {
      id: 12,
      name: 'Nước Mắm Cá Vàng Hỗn Hợp 500ml',
      description: 'Nước mắm truyền thống hỗn hợp cá tuyển chọn làng nghề Sa Châu, vị hài hòa dễ sử dụng hàng ngày.',
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

  console.log('🎉 Đã chuẩn hóa toàn bộ tiêu đề, mô tả SEO và ảnh sản phẩm thành công!');
}

main().catch(console.error);
