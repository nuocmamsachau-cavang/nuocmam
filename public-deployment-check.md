# Kiểm tra website công khai

Ngày 2026-08-12.

Đã mở `https://nuocmampro-fdjnndux.manus.space/` sau deployment. Trang Chủ tải thành công, tiêu đề là “Nước Mắm Cá Vàng - Tinh Túy Làng Nghề 200 Năm”, hero hiển thị, hai thẻ “Khuyến Mãi Đặc Biệt” và “Mua 2 Tặng 1” hiển thị, phần giới thiệu và liên hệ cũng có mặt. Browser console không có output lỗi.

Ảnh chụp viewport cho thấy vùng mascot ở góc trái header đang hiển thị như vòng tròn viền vàng thay vì thấy rõ hình mascot; cần kiểm tra riêng URL storage/ảnh header nếu người dùng yêu cầu khắc phục hiển thị logo trên domain công khai.

Kiểm tra `https://www.gosa.com.vn` (trình duyệt chuẩn hóa sang `https://gosa.com.vn/`) cho thấy website đang trả cùng giao diện và cùng nội dung với domain Manus: hai khối khuyến mãi, hero, logo mascot và tiêu đề đều tải được. Không thấy dấu hiệu đang chạy bản cũ ở phần Trang Chủ; tuy nhiên ảnh chụp vẫn cho thấy mascot header rất nhỏ/khó nhận diện ở viewport này, cần xem URL ảnh nếu muốn tối ưu riêng phần logo.

Kiểm tra lại `https://nuocmampro-fdjnndux.manus.space/` sau khi tạo khuyến mãi SA-20: Trang Chủ hiển thị thẻ thật “Ưu Đãi 20%” với mô tả “Ưu đãi 20% cho khách hàng yêu thích hương vị Sa Châu.” Thẻ fallback “Khuyến Mãi Đặc Biệt”/“Mua 2 Tặng 1” không còn hiển thị; chỉ còn một thẻ vì database hiện có một ưu đãi đang hiệu lực. Đây là bằng chứng dữ liệu backend đã đi qua `promotions.list` và render public thành công.

Kiểm tra `/blog`: domain public `https://nuocmampro-fdjnndux.manus.space/blog` vẫn trả 404 vì checkpoint mới chưa được publish. Bản preview `https://3000-ia7zckkubxutahwa9ppl6-8d78cf6b.sg1.manus.computer/blog` đã nhận route mới và hiển thị tiêu đề “Bài Viết Nước Mắm Cá Vàng”, nhưng tại thời điểm tải còn ở trạng thái “Đang tải bài viết...”; cần kiểm tra lại sau khi tRPC hoàn tất hoặc sau restart nếu cần.

Kiểm tra preview: `/blog` đã render đúng empty state “Chưa có bài viết được xuất bản”. `/product/1` trả “Sản phẩm không tìm thấy” vì ID 1 không tồn tại trong database preview; không thể dùng ID này để kiểm tra form review. Cần lấy một product ID đang tồn tại từ danh sách public rồi kiểm tra lại ProductDetail.

Kiểm tra lỗi khuyến mãi ngày 2026-08-12: database chỉ có 1 dòng là `SA-20` (20%, hiệu lực 12/08/2026–31/08/2026, isActive=1). Domain public `gosa.com.vn` hiển thị đúng 1 thẻ “Ưu Đãi 20%”. Preview hiện tại tại thời điểm kiểm tra vẫn hiển thị 2 thẻ fallback “Khuyến Mãi Đặc Biệt” và “Mua 2 Tặng 1”, cho thấy phiên preview đang dùng dữ liệu/logic fallback cũ hoặc cache chưa đồng bộ. Không có dòng khuyến mãi thứ hai trong database để hiển thị.

Sau khi restart preview lúc 10:10, Trang Chủ preview đã hiển thị đúng một thẻ “Ưu Đãi 20%” với mô tả SA-20; request promotions.list không còn rơi về hai thẻ fallback. Nguyên nhân là preview/server từng trả lỗi 500 khi đọc bảng promotions theo schema đầy đủ, khiến Home coi dữ liệu là undefined và dùng fallback. Domain public gosa.com.vn cũng đang hiển thị SA-20.
