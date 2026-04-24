import { notifyNewOrder, generateOrderEmailHTML, generateZaloMessage, type OrderNotificationData } from "./notifications";

/**
 * Wire notifications vào order creation flow
 * Gửi thông báo cho chủ cửa hàng khi có đơn hàng mới
 */
export async function handleNewOrderNotifications(order: OrderNotificationData): Promise<{
  ownerNotified: boolean;
  emailTemplate: string;
  zaloMessage: string;
}> {
  try {
    // Gửi thông báo cho chủ cửa hàng
    const ownerNotified = await notifyNewOrder(order);

    // Tạo templates cho email và Zalo
    const emailTemplate = generateOrderEmailHTML(order);
    const zaloMessage = generateZaloMessage(order);

    console.log(`[Order Notifications] Order ${order.orderNumber} notifications sent:`, {
      ownerNotified,
      emailTemplate: `${emailTemplate.length} bytes`,
      zaloMessage: `${zaloMessage.length} bytes`,
    });

    return {
      ownerNotified,
      emailTemplate,
      zaloMessage,
    };
  } catch (error) {
    console.error("[Order Notifications] Failed to handle order notifications:", error);
    throw error;
  }
}

/**
 * Utility để convert order từ database format sang notification format
 */
export function convertOrderToNotificationData(order: {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
  totalAmount: number;
  createdAt: Date;
}): OrderNotificationData {
  return {
    orderNumber: `ORD-${order.createdAt.getFullYear()}${String(order.createdAt.getMonth() + 1).padStart(2, "0")}${String(order.createdAt.getDate()).padStart(2, "0")}-${String(order.id).padStart(4, "0")}`,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail,
    customerAddress: order.customerAddress,
    items: order.items.map((item) => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount: order.totalAmount,
  };
}
