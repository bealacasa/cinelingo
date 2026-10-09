import { describe, expect, it } from "vitest";
import { redact } from "./logger";

describe("redact", () => {
  it("oculta claves sensibles", () => {
    expect(redact({ email: "a@b.com", token: "x", ip: "1.2.3.4", code: "otp_expired" })).toEqual({
      email: "[redacted]",
      token: "[redacted]",
      ip: "[redacted]",
      code: "otp_expired",
    });
  });

  it("enmascara emails y JWT dentro de textos", () => {
    const out = redact(
      "fallo para ana@example.com con eyJhbGciOi.eyJzdWIiOi.c2lnbmF0dXJl",
    ) as string;
    expect(out).not.toContain("ana@example.com");
    expect(out).toContain("[email]");
    expect(out).toContain("[jwt]");
  });

  it("recorre objetos anidados y errores", () => {
    expect(redact({ nested: { authorization: "Bearer x" } })).toEqual({
      nested: { authorization: "[redacted]" },
    });
    expect(redact(new Error("x@y.es"))).toEqual({ name: "Error", message: "[email]" });
  });
});
