import { describe, expect, it } from "vitest";
import { buildCsp, createNonce } from "./csp";
import { HSTS_VALUE, STATIC_SECURITY_HEADERS, permissionsPolicyFor } from "./headers";
import { safeNextPath } from "./redirect";

describe("buildCsp", () => {
  const prod = buildCsp({ nonce: "abc", isDev: false, isLocalHttp: false });

  it("no permite unsafe-inline ni unsafe-eval en producción", () => {
    expect(prod).not.toContain("unsafe-inline");
    expect(prod).not.toContain("unsafe-eval");
  });

  it("incluye nonce, strict-dynamic y directivas anti-clickjacking/inyección", () => {
    expect(prod).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'");
    expect(prod).toContain("style-src 'self' 'nonce-abc'");
    expect(prod).toContain("frame-ancestors 'none'");
    expect(prod).toContain("object-src 'none'");
    expect(prod).toContain("base-uri 'none'");
    expect(prod).toContain("upgrade-insecure-requests");
  });

  it("omite upgrade-insecure-requests en http://localhost", () => {
    expect(buildCsp({ nonce: "n", isDev: false, isLocalHttp: true })).not.toContain(
      "upgrade-insecure-requests",
    );
  });
});

describe("createNonce", () => {
  it("genera nonces de 128 bits distintos en cada llamada", () => {
    const a = createNonce();
    expect(atob(a)).toHaveLength(16);
    expect(createNonce()).not.toBe(a);
  });
});

describe("permissionsPolicyFor", () => {
  it("bloquea el micrófono por defecto", () => {
    expect(permissionsPolicyFor("/")).toContain("microphone=()");
    expect(permissionsPolicyFor("/practicar")).toContain("microphone=()");
    expect(permissionsPolicyFor("/practicar/shadowingX")).toContain("microphone=()");
  });

  it("permite el micrófono solo en shadowing", () => {
    expect(permissionsPolicyFor("/practicar/shadowing")).toContain("microphone=(self)");
    expect(permissionsPolicyFor("/practicar/shadowing/abc")).toContain("microphone=(self)");
  });

  it("bloquea cámara y geolocalización siempre", () => {
    const policy = permissionsPolicyFor("/practicar/shadowing");
    expect(policy).toContain("camera=()");
    expect(policy).toContain("geolocation=()");
  });
});

describe("cabeceras estáticas", () => {
  it("incluye HSTS con subdominios y nosniff", () => {
    const map = new Map(STATIC_SECURITY_HEADERS.map((h) => [h.key, h.value]));
    expect(HSTS_VALUE).toMatch(/max-age=\d{8,}; includeSubDomains/);
    expect(map.get("X-Content-Type-Options")).toBe("nosniff");
    expect(map.get("X-Frame-Options")).toBe("DENY");
  });
});

describe("safeNextPath", () => {
  it.each([
    ["/ajustes", "/ajustes"],
    ["/cita/123?x=1", "/cita/123?x=1"],
  ])("acepta rutas internas: %s", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });

  it.each([
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "javascript:alert(1)",
    "evil.com",
    "/\t/evil.com",
    "",
    undefined,
    ["/a"],
    `/${"a".repeat(600)}`,
  ])("rechaza destinos externos o raros: %s", (input) => {
    expect(safeNextPath(input)).toBe("/");
  });
});
