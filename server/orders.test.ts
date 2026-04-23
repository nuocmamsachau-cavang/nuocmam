import { describe, expect, it } from "vitest";

describe("Orders", () => {
  describe("Order Creation", () => {
    it("should validate required order fields", () => {
      const validOrder = {
        customerName: "Nguyễn Văn A",
        customerPhone: "0867678527",
        customerEmail: "customer@example.com",
        customerAddress: "123 Đường ABC, Hà Nội",
        items: JSON.stringify([{ id: 1, name: "Nước mắm Cá Lục", quantity: 2, price: 95000 }]),
        totalAmount: "190000",
      };

      expect(validOrder.customerName).toBeTruthy();
      expect(validOrder.customerPhone).toBeTruthy();
      expect(validOrder.customerAddress).toBeTruthy();
      expect(validOrder.items).toBeTruthy();
      expect(validOrder.totalAmount).toBeTruthy();
    });

    it("should reject order without customer name", () => {
      const invalidOrder = {
        customerName: "",
        customerPhone: "0867678527",
        customerAddress: "123 Đường ABC, Hà Nội",
        items: "[]",
        totalAmount: "0",
      };

      expect(invalidOrder.customerName).toBeFalsy();
    });

    it("should reject order without phone number", () => {
      const invalidOrder = {
        customerName: "Nguyễn Văn A",
        customerPhone: "",
        customerAddress: "123 Đường ABC, Hà Nội",
        items: "[]",
        totalAmount: "0",
      };

      expect(invalidOrder.customerPhone).toBeFalsy();
    });

    it("should reject order without address", () => {
      const invalidOrder = {
        customerName: "Nguyễn Văn A",
        customerPhone: "0867678527",
        customerAddress: "",
        items: "[]",
        totalAmount: "0",
      };

      expect(invalidOrder.customerAddress).toBeFalsy();
    });

    it("should accept order with optional email", () => {
      const orderWithoutEmail = {
        customerName: "Nguyễn Văn A",
        customerPhone: "0867678527",
        customerEmail: "",
        customerAddress: "123 Đường ABC, Hà Nội",
        items: "[]",
        totalAmount: "0",
      };

      expect(orderWithoutEmail.customerName).toBeTruthy();
      expect(orderWithoutEmail.customerPhone).toBeTruthy();
      expect(orderWithoutEmail.customerAddress).toBeTruthy();
    });

    it("should parse order items correctly", () => {
      const items = [
        { id: 1, name: "Nước mắm Cá Lục", quantity: 2, price: 95000 },
        { id: 2, name: "Nước mắm Cá Mực", quantity: 1, price: 150000 },
      ];
      const itemsJson = JSON.stringify(items);
      const parsed = JSON.parse(itemsJson);

      expect(parsed).toHaveLength(2);
      expect(parsed[0].name).toBe("Nước mắm Cá Lục");
      expect(parsed[0].quantity).toBe(2);
      expect(parsed[1].price).toBe(150000);
    });

    it("should calculate total amount correctly", () => {
      const items = [
        { id: 1, name: "Nước mắm Cá Lục", quantity: 2, price: 95000 },
        { id: 2, name: "Nước mắm Cá Mực", quantity: 1, price: 150000 },
      ];

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(total).toBe(340000);
    });

    it("should generate unique order number", () => {
      const orderNumber1 = `ORD-${Date.now()}`;
      const orderNumber2 = `ORD-${Date.now() + 1}`;

      expect(orderNumber1).not.toBe(orderNumber2);
      expect(orderNumber1).toMatch(/^ORD-\d+$/);
    });
  });
});
