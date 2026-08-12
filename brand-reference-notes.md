# Ghi chú tham khảo Brand Library

## Mẫu quan sát từ nuocmamlegia.com

- Header dùng logo ngang ở góc trái, thanh điều hướng rõ ràng và giỏ hàng ở góc phải.
- Trang chủ có một vùng hero/banner lớn ngay dưới header; ảnh banner là tài sản chính của trang, không chỉ lưu trong thư viện mà phải được render thực tế.
- Phần giới thiệu thương hiệu có bố cục hai cột: tiêu đề/nội dung và hình ảnh minh họa.
- Khu vực sản phẩm nổi bật hiển thị dạng lưới/card; mỗi card có ảnh sản phẩm, tên, giá, nút thêm vào giỏ và nút xem chi tiết.
- Trang tất cả sản phẩm chia thành các nhóm có tiêu đề riêng, dùng lưới nhiều cột; vùng ảnh chiếm phần lớn card và giữ tỷ lệ nhất quán.
- Favicon/logo là tài sản nhận diện riêng, cần cập nhật ở thẻ <link rel="icon"> thay vì chỉ hiển thị trong một component React.

## Tiêu chí áp dụng cho Nước Mắm Cá Vàng

- brand_mascot_logo: dùng ở header trên desktop/mobile.
- brand_horizontal_logo: dùng ở footer và/hoặc khu vực hero khi có ảnh logo ngang.
- brand_favicon: dùng động trong document head để thay favicon.
- brand_hero_banner: dùng làm ảnh nền thật của hero trên trang chủ, có lớp phủ màu để chữ vẫn đọc được; nếu chưa có ảnh thì giữ nền đỏ-gold hiện tại.
- Tài sản không có giá trị phải tự động fallback về giao diện hiện tại, không tạo khung trắng hoặc ảnh hỏng.
- Tài sản tải lên cần được lưu bằng URL ổn định trong storage/database; không nên lưu Base64 lớn vào websiteSettings vì làm chậm trang và có thể gây giới hạn dữ liệu.

## Vấn đề cần sửa

Brand Library hiện đã lưu giá trị nhưng Home.tsx mới chỉ đọc mascot logo. Các trường horizontal logo, favicon và hero banner chưa được sử dụng trong giao diện công khai, nên người dùng thay ảnh trong Admin Panel nhưng không thấy thay đổi trên website.

## Kiểm tra bản xem trước Admin Panel

Tab `Thương Hiệu` đã hiển thị đúng bốn vùng quản lý: Logo Mascot, Logo Ngang, Favicon và Banner Trang Chủ. Giao diện đã có cả nhập URL và tải tệp. Tuy nhiên bản xem trước hiện đang báo “Chưa có ảnh” ở các trường này, nên cần người quản trị tải ảnh thực tế vào từng trường; hệ thống mới sẽ đưa từng trường vào đúng vị trí công khai tương ứng.

## Kiểm tra website công khai bản xem trước

Trang chủ hiển thị mascot ở header, hero vẫn giữ nền đỏ-gold khi chưa có banner, và không xuất hiện khung ảnh lỗi ở footer khi chưa có logo ngang. Đây là trạng thái fallback đúng; sau khi người dùng upload từng tài sản, URL lưu trong Brand Library sẽ được đọc lại và render ở đúng vị trí tương ứng.

## Kiểm tra sau Phase 25

Admin Panel hiện hiển thị thêm trường “Tiêu Đề Website / SEO Title” với giá trị mặc định rõ ràng, cùng bốn vùng media. Khi database chưa có ảnh, các vùng vẫn hiển thị trạng thái “Chưa có ảnh” thay vì ảnh hỏng; điều này xác nhận fallback giao diện hoạt động an toàn.

## Kiểm thử thay thế tài sản thực tế

Đã nhập URL mascot storage hiện có vào trường `Logo Ngang / Full Brand`; bản xem trước Admin Panel lập tức hiển thị ảnh trong vùng preview, xác nhận form nhận giá trị URL và preview hoạt động. Thao tác lưu được gửi tiếp để kiểm tra dữ liệu trên trang công khai.
