import { describe, it, expect } from "bun:test";
import { formatUSPhone, isValidUSPhone, digitsOnly } from "../src/lib/phone";

describe("US phone utilities", () => {
  it("formats 10 digits into (XXX) XXX-XXXX", () => {
    expect(formatUSPhone("1234567890")).toBe("(123) 456-7890");
  });

  it("formats progressively while typing", () => {
    expect(formatUSPhone("1")).toBe("(1");
    expect(formatUSPhone("12")).toBe("(12");
    expect(formatUSPhone("123")).toBe("(123");
    expect(formatUSPhone("1234")).toBe("(123) 4");
    expect(formatUSPhone("12345")).toBe("(123) 45");
    expect(formatUSPhone("123456")).toBe("(123) 456");
    expect(formatUSPhone("1234567")).toBe("(123) 456-7");
    expect(formatUSPhone("12345678")).toBe("(123) 456-78");
    expect(formatUSPhone("123456789")).toBe("(123) 456-789");
    expect(formatUSPhone("1234567890")).toBe("(123) 456-7890");
  });

  it("truncates extra digits beyond 10", () => {
    expect(formatUSPhone("12345678901")).toBe("(123) 456-7890");
  });

  it("validates correct formatted numbers", () => {
    expect(isValidUSPhone("(123) 456-7890")).toBeTrue();
    expect(isValidUSPhone("(000) 000-0000")).toBeTrue();
  });

  it("invalidates incorrect formats", () => {
    expect(isValidUSPhone("123-456-7890")).toBeFalse();
    expect(isValidUSPhone("(123)456-7890")).toBeFalse();
    expect(isValidUSPhone("(123) 456-789")).toBeFalse();
    expect(isValidUSPhone("(12) 345-67890")).toBeFalse();
  });

  it("digitsOnly strips non-digits", () => {
    expect(digitsOnly("(123) 456-7890")).toBe("1234567890");
    expect(digitsOnly("abc123def")).toBe("123");
  });
});
