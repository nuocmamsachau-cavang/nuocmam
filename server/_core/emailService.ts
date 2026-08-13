import nodemailer from 'nodemailer';
import { getEmailConfig } from '../db.js';

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  items: any[],
  totalAmount: string
) {
  try {
    const config = await getEmailConfig();
    if (!config || !config.isActive) {
      console.warn('[Email] Email service not configured');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpServer,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });

    const itemsHtml = items
      .map((item: any) => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.price} VNĐ</td></tr>`)
      .join('');

    const htmlContent = `
      <h2>Xác Nhận Đơn Hàng</h2>
      <p>Cảm ơn <strong>${customerName}</strong> đã đặt hàng!</p>
      <p><strong>Mã Đơn Hàng:</strong> ${orderNumber}</p>
      <table border="1" cellpadding="10">
        <tr><th>Sản Phẩm</th><th>Số Lượng</th><th>Giá</th></tr>
        ${itemsHtml}
      </table>
      <p><strong>Tổng Tiền:</strong> ${totalAmount} VNĐ</p>
      <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.</p>
      <p>Cảm ơn bạn!</p>
    `;

    await transporter.sendMail({
      from: config.fromEmail,
      to: customerEmail,
      subject: `Xác Nhận Đơn Hàng ${orderNumber} - Nước Mắm Cá Vàng`,
      html: htmlContent,
    });

    console.log(`[Email] Order confirmation sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send email:', error);
    return false;
  }
}

export async function sendAdminNotificationEmail(
  orderNumber: string,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  totalAmount: string
) {
  try {
    const config = await getEmailConfig();
    if (!config || !config.isActive) {
      console.warn('[Email] Email service not configured');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpServer,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });

    const htmlContent = `
      <h2>📦 Đơn Hàng Mới</h2>
      <p><strong>Mã Đơn:</strong> ${orderNumber}</p>
      <p><strong>Khách Hàng:</strong> ${customerName}</p>
      <p><strong>Điện Thoại:</strong> ${customerPhone}</p>
      <p><strong>Địa Chỉ:</strong> ${customerAddress}</p>
      <p><strong>Tổng Tiền:</strong> ${totalAmount} VNĐ</p>
      <p>Vui lòng xử lý đơn hàng này trong Admin Panel.</p>
    `;

    await transporter.sendMail({
      from: config.fromEmail,
      to: config.toEmail,
      subject: `Đơn Hàng Mới: ${orderNumber}`,
      html: htmlContent,
    });

    console.log(`[Email] Admin notification sent`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send admin notification:', error);
    return false;
  }
}
