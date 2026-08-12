import { describe, expect, it } from "vitest";
import { generateOrderEmailHTML, generateZaloMessage } from "./notifications";

describe("Order Notifications", () => {
  const mockOrder = {
    orderNumber: "ORD-20260423-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0867678527",
    customerEmail: "customer@example.com",
    customerAddress: "123 Đường ABC, Hà Nội",
    items: [
      { name: "Nước Mắm Cá Nục", quantity: 2, price: 95000 },
      { name: "Nước Mắm Cá Mực", quantity: 1, price: 150000 },
    ],
    totalAmount: 340000,
  };

  describe("Email Template", () => {
    it("should generate valid HTML email", () => {
      const html = generateOrderEmailHTML(mockOrder);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("Nước Mắm Cá Vàng");
      expect(html).toContain(mockOrder.orderNumber);
      expect(html).toContain(mockOrder.customerName);
    });

    it("should include customer information", () => {
      const html = generateOrderEmailHTML(mockOrder);

      expect(html).toContain(mockOrder.customerPhone);
      expect(html).toContain(mockOrder.customerEmail);
      expect(html).toContain(mockOrder.customerAddress);
    });

    it("should include all order items", () => {
      const html = generateOrderEmailHTML(mockOrder);

      expect(html).toContain("Nước Mắm Cá Nục");
      expect(html).toContain("Nước Mắm Cá Mực");
      expect(html).toContain("x2");
      expect(html).toContain("x1");
    });

    it("should include total amount", () => {
      const html = generateOrderEmailHTML(mockOrder);

      expect(html.includes("340000") || html.includes("340,000")).toBe(true);
      expect(html.includes("Tổng Tiền") || html.includes("Tong Tien")).toBe(true);
    });

    it("should include contact information", () => {
      const html = generateOrderEmailHTML(mockOrder);

      expect(html).toContain("0867 678 527");
      expect(html).toContain("nuocmamcavangsachau@gmail.com");
    });

    it("should have proper styling", () => {
      const html = generateOrderEmailHTML(mockOrder);

      expect(html).toContain("style=");
      expect(html).toContain("background");
      expect(html).toContain("color");
    });
  });

  describe("Zalo Message", () => {
    it("should generate valid Zalo message", () => {
      const message = generateZaloMessage(mockOrder);

      expect(message).toContain("ĐƠN HÀNG MỚI");
      expect(message).toContain(mockOrder.orderNumber);
      expect(message).toContain(mockOrder.customerName);
    });

    it("should include customer contact info", () => {
      const message = generateZaloMessage(mockOrder);

      expect(message).toContain(mockOrder.customerPhone);
      expect(message).toContain(mockOrder.customerAddress);
    });

    it("should include all items", () => {
      const message = generateZaloMessage(mockOrder);

      expect(message).toContain("Nước Mắm Cá Nục");
      expect(message).toContain("Nước Mắm Cá Mực");
      expect(message).toContain("x2");
      expect(message).toContain("x1");
    });

    it("should include total amount", () => {
      const message = generateZaloMessage(mockOrder);

      expect(message.includes("340000") || message.includes("340,000")).toBe(true);
      expect(message.includes("Tổng tiền") || message.includes("Tong tien")).toBe(true);
    });

    it("should be under Zalo message length limit", () => {
      const message = generateZaloMessage(mockOrder);

      // Zalo typically supports messages up to 4000 characters
      expect(message.length).toBeLessThan(4000);
    });

    it("should include contact number", () => {
      const message = generateZaloMessage(mockOrder);

      expect(message).toContain("0867 678 527");
    });
  });

  describe("Message Format", () => {
    it("should format currency correctly", () => {
      const html = generateOrderEmailHTML(mockOrder);

      // Check if HTML contains order total (with or without locale formatting)
      expect(html.includes("340000") || html.includes("340,000")).toBe(true);
      expect(html.includes("190000") || html.includes("190,000")).toBe(true); // 2 x 95000
      expect(html.includes("150000") || html.includes("150,000")).toBe(true); // 1 x 150000
    });

    it("should handle items without email", () => {
      const orderWithoutEmail = { ...mockOrder, customerEmail: undefined };
      const html = generateOrderEmailHTML(orderWithoutEmail);

      expect(html).not.toContain("customer@example.com");
      expect(html).toContain("Tên:");
      expect(html).toContain("Điện Thoại:");
    });

    it("should handle multiple items correctly", () => {
      const largeOrder = {
        ...mockOrder,
        items: [
          { name: "Sản phẩm 1", quantity: 5, price: 100000 },
          { name: "Sản phẩm 2", quantity: 3, price: 50000 },
          { name: "Sản phẩm 3", quantity: 2, price: 75000 },
        ],
      };

      const html = generateOrderEmailHTML(largeOrder);
      const message = generateZaloMessage(largeOrder);

      expect(html).toContain("Sản phẩm 1");
      expect(html).toContain("Sản phẩm 2");
      expect(html).toContain("Sản phẩm 3");
      expect(message).toContain("Sản phẩm 1");
      expect(message).toContain("Sản phẩm 2");
      expect(message).toContain("Sản phẩm 3");
    });
  });
});
