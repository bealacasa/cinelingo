import { describe, expect, it } from "vitest";
import { base64urlToBuffer, bufferToBase64url, parseRequestOptions } from "./encoding";

describe("base64url", () => {
  it("ida y vuelta sin pérdida, sin padding ni caracteres + /", () => {
    const bytes = new Uint8Array([0, 251, 255, 62, 63, 1, 2]);
    const encoded = bufferToBase64url(bytes);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(new Uint8Array(base64urlToBuffer(encoded))).toEqual(bytes);
  });
});

describe("parseRequestOptions", () => {
  it("convierte challenge y allowCredentials a binario", () => {
    const options = parseRequestOptions({
      challenge: bufferToBase64url(new Uint8Array([1, 2, 3])),
      allowCredentials: [{ id: bufferToBase64url(new Uint8Array([9])), type: "public-key" }],
      rpId: "cinelingo.app",
    });
    expect(new Uint8Array(options.challenge as ArrayBuffer)).toEqual(new Uint8Array([1, 2, 3]));
    expect(new Uint8Array(options.allowCredentials?.[0]?.id as ArrayBuffer)).toEqual(
      new Uint8Array([9]),
    );
    expect(options.rpId).toBe("cinelingo.app");
  });
});
