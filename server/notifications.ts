import { notifyOwner } from "./_core/notification";

export interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}

/**
 * Gửi thông báo đơn hàng mới cho chủ cửa hàng
 */
export async function notifyNewOrder(order: OrderNotificationData): Promise<boolean> {
  const itemsList = order.items
    .map((item) => `- ${item.name} x${item.quantity}: ${(item.price * item.quantity).toLocaleString()}₫`)
    .join("\n");

  const content = `
📦 **Đơn Hàng Mới**

**Mã Đơn:** ${order.orderNumber}
**Khách Hàng:** ${order.customerName}
**Điện Thoại:** ${order.customerPhone}
**Email:** ${order.customerEmail || "Không có"}
**Địa Chỉ:** ${order.customerAddress}

**Sản Phẩm:**
${itemsList}

**Tổng Tiền:** ${order.totalAmount.toLocaleString()}₫

---
Vui lòng xác nhận đơn hàng trong Admin Panel.
  `.trim();

  try {
    const result = await notifyOwner({
      title: `🛍️ Đơn hàng mới: ${order.orderNumber}`,
      content,
    });
    return result;
  } catch (error) {
    console.error("[Notification] Failed to send order notification:", error);
    return false;
  }
}

/**
 * Tạo email template cho khách hàng
 */
export function generateOrderEmailHTML(order: OrderNotificationData): string {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString()}₫</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #C41E3A 0%, #8B1428 100%); color: white; padding: 20px; text-align: center; border-radius: 5px; }
    .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 5px; }
    .order-info { background: white; padding: 15px; border-left: 4px solid #D4AF37; margin: 15px 0; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .total { text-align: right; font-size: 18px; font-weight: bold; color: #C41E3A; padding: 15px 0; border-top: 2px solid #D4AF37; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
    .button { background: #C41E3A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐠 Nước Mắm Cá Vàng</h1>
      <p>Tinh Túy Làng Nghề Sa Châu 200 Năm</p>
    </div>

    <div class="content">
      <h2>✓ Đơn Hàng Đã Được Tiếp Nhận</h2>
      <p>Cảm ơn bạn đã đặt hàng tại Nước Mắm Cá Vàng!</p>

      <div class="order-info">
        <p><strong>Mã Đơn Hàng:</strong> ${order.orderNumber}</p>
        <p><strong>Thời Gian:</strong> ${new Date().toLocaleString("vi-VN")}</p>
      </div>

      <h3>📋 Thông Tin Khách Hàng</h3>
      <div class="order-info">
        <p><strong>Tên:</strong> ${order.customerName}</p>
        <p><strong>Điện Thoại:</strong> <a href="tel:${order.customerPhone}">${order.customerPhone}</a></p>
        ${order.customerEmail ? `<p><strong>Email:</strong> ${order.customerEmail}</p>` : ""}
        <p><strong>Địa Chỉ:</strong> ${order.customerAddress}</p>
      </div>

      <h3>📦 Sản Phẩm Đã Đặt</h3>
      <table>
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 10px; text-align: left;">Sản Phẩm</th>
            <th style="padding: 10px; text-align: center;">Số Lượng</th>
            <th style="padding: 10px; text-align: right;">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="total">
        Tổng Tiền: ${order.totalAmount.toLocaleString()}₫
      </div>

      <h3>📞 Bước Tiếp Theo</h3>
      <ol>
        <li>Chúng tôi sẽ xác nhận đơn hàng qua <strong>SMS/Zalo</strong> trong vòng <strong>2 giờ</strong></li>
        <li>Bạn sẽ nhận được thông tin chi tiết về <strong>thời gian giao hàng</strong></li>
        <li>Thanh toán khi nhận hàng (COD) hoặc theo thỏa thuận</li>
        <li>Nếu có thắc mắc, liên hệ: <strong>0867 678 527</strong></li>
      </ol>

      <div style="text-align: center; margin: 20px 0;">
        <a href="https://nuocmampro-fdjnndux.manus.space/order-confirmation" class="button">Xem Chi Tiết Đơn Hàng</a>
      </div>
    </div>

    <div class="footer">
      <p>© 2026 Nước Mắm Cá Vàng - Tinh Túy Làng Nghề Sa Châu 200 Năm</p>
      <p>Địa Chỉ: Làng Sa Châu, Giao Hưng, Ninh Bình, Việt Nam</p>
      <p>Điện Thoại: 0867 678 527 | Email: nuocmamcavangsachau@gmail.com</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Tạo message template cho Zalo
 */
export function generateZaloMessage(order: OrderNotificationData): string {
  const itemsList = order.items.map((item) => `• ${item.name} x${item.quantity}`).join("\n");

  return `
🛍️ *ĐƠN HÀNG MỚI*

Mã đơn: ${order.orderNumber}
Khách: ${order.customerName}
SĐT: ${order.customerPhone}
Địa chỉ: ${order.customerAddress}

📦 Sản phẩm:
${itemsList}

💰 Tổng tiền: ${order.totalAmount.toLocaleString()}₫

✓ Chúng tôi sẽ xác nhận trong 2 giờ
📞 Liên hệ: 0867 678 527

Cảm ơn bạn đã đặt hàng! 🙏
  `.trim();
}
