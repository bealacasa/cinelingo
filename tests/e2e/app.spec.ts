import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("cabeceras de seguridad", () => {
  test("las páginas llevan CSP con nonce, sin unsafe-* y con las cabeceras clave", async ({
    request,
  }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["content-security-policy"]).toMatch(
      /script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/,
    );
    expect(h["content-security-policy"]).not.toContain("unsafe-inline");
    expect(h["content-security-policy"]).not.toContain("unsafe-eval");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    // HSTS se omite a propósito en http://localhost (se comprueba en el test de unidad y en el preview HTTPS).
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"]).toContain("microphone=()");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  for (const path of ["/", "/privacidad", "/login", "/no-existe"]) {
    test(`todos los <script> de ${path} llevan el nonce de la CSP`, async ({ request }) => {
      const res = await request.get(path);
      const nonce = /'nonce-([^']+)'/.exec(res.headers()["content-security-policy"] ?? "")?.[1];
      expect(nonce).toBeTruthy();
      const html = await res.text();
      const scripts = html.match(/<script\b[^>]*>/g) ?? [];
      expect(scripts.length).toBeGreaterThan(0);
      for (const tag of scripts) expect(tag).toContain(`nonce="${nonce}"`);
    });
  }

  test("el nonce cambia en cada petición", async ({ request }) => {
    const nonce = async () =>
      /'nonce-([^']+)'/.exec(
        (await request.get("/privacidad")).headers()["content-security-policy"] ?? "",
      )?.[1];
    expect(await nonce()).not.toBe(await nonce());
  });

  test("la API devuelve CSP restrictiva y no-store", async ({ request }) => {
    const res = await request.get("/api/cuenta/exportar");
    expect(res.status()).toBe(401);
    expect(res.headers()["content-security-policy"]).toContain("default-src 'none'");
    expect(res.headers()["cache-control"]).toContain("no-store");
  });
});

test.describe("cita del día", () => {
  test("muestra cita, atribución y desglose sin errores de CSP", async ({ page }) => {
    const cspErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && /Content Security Policy|CSP/i.test(msg.text()))
        cspErrors.push(msg.text());
    });
    await page.goto("/");
    await expect(page.locator("blockquote")).toBeVisible();
    await expect(page.locator("figcaption cite")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Desglose" })).toBeVisible();
    expect(cspErrors).toEqual([]);
  });

  test("el resaltado enlaza a la explicación de la expresión", async ({ page }) => {
    await page.goto("/");
    const highlight = page.locator("blockquote a").first();
    const target = await highlight.getAttribute("href");
    await highlight.click();
    await expect(page.locator(target!)).toBeInViewport();
  });

  test("navega al detalle de otra cita y vuelve", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href^="/cita/"]').first().click();
    await expect(page).toHaveURL(/\/cita\/[0-9a-f-]{36}$/);
    await expect(page.locator("blockquote")).toBeVisible();
  });

  test("una cita inexistente o un id malicioso devuelven 404", async ({ request }) => {
    expect((await request.get("/cita/00000000-0000-5000-8000-000000000000")).status()).toBe(404);
    expect((await request.get("/cita/' OR 1=1 --")).status()).toBe(404);
  });
});

test.describe("explorar", () => {
  test("filtra por tema y marca el chip activo", async ({ page }) => {
    await page.goto("/explorar");
    const all = await page.locator('main a[href^="/cita/"]').count();
    expect(all).toBeGreaterThanOrEqual(30);
    await page.getByRole("link", { name: /^Sarcasmo/ }).click();
    await expect(page).toHaveURL(/tema=sarcasmo/);
    await expect(page.getByRole("link", { name: /^Sarcasmo/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const filtered = await page.locator('main a[href^="/cita/"]').count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(all);
  });

  test("un filtro inválido o malicioso se ignora", async ({ page }) => {
    await page.goto("/explorar?tema=%3Cscript%3Ealert(1)%3C/script%3E&obra=..%2F..%2Fetc");
    const temas = page.getByRole("navigation", { name: "Temas" });
    const obras = page.getByRole("navigation", { name: "Series y películas" });
    await expect(temas.getByRole("link", { name: "Todos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(obras.getByRole("link", { name: "Todas" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(await page.locator('main a[href^="/cita/"]').count()).toBeGreaterThanOrEqual(30);
  });

  test("filtra por saga y se combina con el tema", async ({ page }) => {
    await page.goto("/explorar");
    const obras = page.getByRole("navigation", { name: "Series y películas" });
    await obras.getByRole("link", { name: /^Harry Potter/ }).click();
    await expect(page).toHaveURL(/obra=harry-potter/);
    const tiles = page.locator('main a[href^="/cita/"]');
    await expect(tiles).toHaveCount(4);
    for (const tile of await tiles.all()) await expect(tile).toContainText("Harry Potter");

    await page
      .getByRole("navigation", { name: "Temas" })
      .getByRole("link", { name: /^Humor\s*\d+$/ })
      .click();
    await expect(page).toHaveURL(/tema=humor/);
    await expect(page).toHaveURL(/obra=harry-potter/);
    await expect(tiles).toHaveCount(1);
  });

  for (const path of ["/", "/explorar"]) {
    test(`sin scroll horizontal en ${path}`, async ({ page }) => {
      await page.goto(path);
      const [scroll, viewport] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        window.innerWidth,
      ]);
      expect(scroll).toBeLessThanOrEqual(viewport);
    });
  }

  test("la traducción está oculta hasta que se pide", async ({ page }) => {
    await page.goto("/");
    const details = page.locator("details");
    await expect(details).not.toHaveAttribute("open");
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open");
  });
});

test.describe("rutas protegidas", () => {
  test("ajustes redirige al login conservando la ruta", async ({ page }) => {
    await page.goto("/ajustes");
    await expect(page).toHaveURL(/\/login\?next=%2Fajustes$/);
  });

  test("el login ignora destinos externos en next", async ({ page }) => {
    const res = await page.goto("/login?next=https://evil.example");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Entra en CineLingo" })).toBeVisible();
  });

  test("el enlace de confirmación no inicia sesión con un GET", async ({ page }) => {
    await page.goto("/auth/confirm?token_hash=abcdefghijklmnop&type=email");
    await expect(page.getByRole("button", { name: "Confirmar y entrar" })).toBeVisible();
  });
});

test.describe("accesibilidad (WCAG 2.2 AA)", () => {
  for (const path of ["/", "/explorar", "/login", "/privacidad"]) {
    test(`sin infracciones de axe en ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  }

  test("los objetivos táctiles principales miden al menos 44px", async ({ page }) => {
    await page.goto("/");
    // Cabecera + barra de pestañas (en móvil la navegación vive abajo) + chips de Explorar.
    const targets = page.locator("header a:visible, nav[aria-label='Secciones'] a:visible");
    expect(await targets.count()).toBeGreaterThanOrEqual(3);
    for (const link of await targets.all()) {
      const box = await link.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
    await page.goto("/explorar");
    for (const chip of await page.locator("main nav a").all()) {
      const box = await chip.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test("los campos tienen 16px o más (sin zoom en iOS)", async ({ page }) => {
    await page.goto("/ajustes");
    await page.goto("/login");
    const inputs = page.locator("input:not([type=hidden])");
    for (const input of await inputs.all()) {
      const size = await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(size).toBeGreaterThanOrEqual(16);
    }
  });
});
