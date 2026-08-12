# Brand Library Validation Result

Ngày kiểm thử: 2026-08-12.

Script kiểm thử đã gọi đúng contract `brand.update` và `brand.get` của ứng dụng preview. Bốn tài sản `brand_mascot_logo`, `brand_horizontal_logo`, `brand_favicon` và `brand_hero_banner` lần lượt được lưu bằng URL mascot storage thực tế, sau đó đọc lại từ `brand.get` và đối chiếu đúng giá trị. `brand_site_title` cũng được lưu bằng tiêu đề kiểm thử và đọc lại đúng giá trị.

Sau khi kiểm thử, trạng thái được hoàn nguyên an toàn: mascot giữ URL nhận diện chính hãng hiện tại, logo ngang/favicon/banner được đưa về rỗng để giao diện dùng fallback, và tiêu đề website được đưa về `Nước Mắm Cá Vàng - Tinh Túy Làng Nghề 200 Năm`.

Kết quả: `save/readback validation: PASS`; `restore validation: PASS`.

Mapping public được kiểm thử độc lập trong Vitest: mascot -> header, horizontal logo -> footer/brand section, favicon -> document icon, hero banner -> hero background, site title -> `document.title`.
