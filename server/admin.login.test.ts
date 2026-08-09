import { describe, expect, it, beforeAll } from "vitest";
import { hashPassword, verifyPassword, generateAdminToken, verifyAdminToken } from "./auth";

describe("Admin Authentication", () => {
  describe("Password Hashing", () => {
    it("should hash password with salt", () => {
      const password = "testpassword123";
      const hash = hashPassword(password);
      
      expect(hash).toContain(":");
      const [salt, hashedPart] = hash.split(":");
      expect(salt).toHaveLength(32); // 16 bytes = 32 hex chars
      expect(hashedPart).toHaveLength(128); // 64 bytes = 128 hex chars
    });

    it("should verify correct password", () => {
      const password = "testpassword123";
      const hash = hashPassword(password);
      
      expect(verifyPassword(password, hash)).toBe(true);
    });

    it("should reject incorrect password", () => {
      const password = "testpassword123";
      const hash = hashPassword(password);
      
      expect(verifyPassword("wrongpassword", hash)).toBe(false);
    });

    it("should produce different hashes for same password", () => {
      const password = "testpassword123";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
      expect(verifyPassword(password, hash1)).toBe(true);
      expect(verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe("JWT Token", () => {
    it("should generate valid token", () => {
      const adminId = 1;
      const token = generateAdminToken(adminId);
      
      expect(token).toContain(".");
      const parts = token.split(".");
      expect(parts).toHaveLength(3);
    });

    it("should verify valid token", () => {
      const adminId = 1;
      const token = generateAdminToken(adminId);
      const verified = verifyAdminToken(token);
      
      expect(verified).not.toBeNull();
      expect(verified?.adminId).toBe(adminId);
    });

    it("should reject invalid token", () => {
      const invalidToken = "invalid.token.here";
      const verified = verifyAdminToken(invalidToken);
      
      expect(verified).toBeNull();
    });

    it("should reject tampered token", () => {
      const adminId = 1;
      const token = generateAdminToken(adminId);
      const parts = token.split(".");
      const tamperedToken = `${parts[0]}.${parts[1]}.invalidsignature`;
      
      const verified = verifyAdminToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it("should reject expired token", () => {
      // Create a token with expired timestamp
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
      const expiredPayload = {
        adminId: 1,
        iat: Math.floor(Date.now() / 1000) - 86400 * 8, // 8 days ago
        exp: Math.floor(Date.now() / 1000) - 1, // expired 1 second ago
      };
      const body = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
      
      const verified = verifyAdminToken(`${header}.${body}.anysignature`);
      expect(verified).toBeNull();
    });
  });
});
