import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));

const { rateLimitKey, RATE_LIMITS } = await import("./rate-limit");

describe("rateLimitKey", () => {
  it("no contiene el identificador en claro (minimización RGPD)", () => {
    const key = rateLimitKey("s".repeat(32), "loginRequestByEmail", "ana@example.com");
    expect(key).not.toContain("ana");
    expect(key).not.toContain("example");
    expect(key.length).toBeLessThanOrEqual(128);
  });

  it("es estable para el mismo secreto y distinta con otro secreto o bucket", () => {
    const a = rateLimitKey("s".repeat(32), "b", "x");
    expect(rateLimitKey("s".repeat(32), "b", "x")).toBe(a);
    expect(rateLimitKey("t".repeat(32), "b", "x")).not.toBe(a);
    expect(rateLimitKey("s".repeat(32), "c", "x")).not.toBe(a);
  });

  it("los límites de login por email son más estrictos que por IP", () => {
    expect(RATE_LIMITS.loginRequestByEmail.limit).toBeLessThan(RATE_LIMITS.loginRequestByIp.limit);
  });
});
