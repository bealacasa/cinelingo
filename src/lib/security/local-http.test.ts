import { describe, expect, it } from "vitest";
import { isLocalHttp } from "./local-http";

describe("isLocalHttp", () => {
  it.each(["localhost", "127.0.0.1", "192.168.1.143", "10.0.0.5", "172.16.0.1", "172.31.255.1"])(
    "http://%s es local",
    (host) => expect(isLocalHttp("http:", host)).toBe(true),
  );

  it.each(["cinelingo.vercel.app", "172.32.0.1", "8.8.8.8", "192.168.1.143.evil.com"])(
    "http://%s no es local",
    (host) => expect(isLocalHttp("http:", host)).toBe(false),
  );

  it("https nunca es local (producción siempre recibe HSTS)", () => {
    expect(isLocalHttp("https:", "localhost")).toBe(false);
    expect(isLocalHttp("https:", "192.168.1.143")).toBe(false);
  });
});
