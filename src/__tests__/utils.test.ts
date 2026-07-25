import { describe, it, expect } from "vitest";
import {
  formatAddress,
  formatCurrency,
  calculateFee,
  calculateExchange,
  calculateCompetitorSavings,
} from "@/lib/utils";

describe("Utility Functions Unit Tests", () => {
  describe("formatAddress", () => {
    it("should format a standard 56-character Stellar address", () => {
      const addr = "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG";
      expect(formatAddress(addr, 4)).toBe("GDSFF...KIOG");
    });

    it("should return empty string for null or undefined", () => {
      expect(formatAddress(null)).toBe("");
      expect(formatAddress(undefined)).toBe("");
    });

    it("should support custom character truncation count", () => {
      const addr = "GBUX3IHQTAIRN3BXVBWZMKFW2CF6FE4QKQWYEDHYGQXL6OQ3YFMN5R3N";
      expect(formatAddress(addr, 6)).toBe("GBUX3IH...MN5R3N");
    });
  });

  describe("formatCurrency", () => {
    it("should format USD correctly", () => {
      expect(formatCurrency(250.5, "USD")).toBe("$250.50");
    });

    it("should format INR with rupee symbol", () => {
      expect(formatCurrency(20862.5, "INR")).toBe("₹20,862.50");
    });

    it("should format NGN with naira symbol", () => {
      const formatted = formatCurrency(148550, "NGN");
      expect(formatted).toContain("₦");
      expect(formatted).toContain("550");
    });

    it("should handle string input gracefully", () => {
      expect(formatCurrency("100.25", "USDC")).toBe("$100.25");
    });

    it("should handle invalid numeric inputs safely", () => {
      expect(formatCurrency("invalid")).toBe("$0.00");
    });
  });

  describe("calculateFee", () => {
    it("should calculate 0.3% protocol fee (30 bps)", () => {
      const { fee, net } = calculateFee(1000, 30);
      expect(fee).toBe(3);
      expect(net).toBe(997);
    });

    it("should handle zero amount", () => {
      const { fee, net } = calculateFee(0, 30);
      expect(fee).toBe(0);
      expect(net).toBe(0);
    });
  });

  describe("calculateExchange", () => {
    it("should compute USDC to INR conversion", () => {
      const { rate, convertedAmount } = calculateExchange(100, "USDC", "INR");
      expect(rate).toBe(83.45);
      expect(convertedAmount).toBe(8345);
    });

    it("should compute USDC to NGN conversion", () => {
      const { rate, convertedAmount } = calculateExchange(100, "USDC", "NGN");
      expect(rate).toBe(1485.5);
      expect(convertedAmount).toBe(148550);
    });
  });

  describe("calculateCompetitorSavings", () => {
    it("should compute savings against Western Union global averages", () => {
      const { stellarFee, westernUnionFee, savings } = calculateCompetitorSavings(500);
      expect(stellarFee).toBe(1.5);
      expect(westernUnionFee).toBe(31.5);
      expect(savings).toBe(30.0);
    });
  });
});
