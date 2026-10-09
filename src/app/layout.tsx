import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { TabBar } from "@/components/layout/Nav";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CineLingo · Inglés C1 con cine y series", template: "%s · CineLingo" },
  description:
    "Consolida tu inglés C1 con citas breves de películas y series: expresiones, matices, registro y pronunciación.",
  applicationName: "CineLingo",
  appleWebApp: { capable: true, title: "CineLingo", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0b" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // CSP con nonce: TODAS las páginas deben renderizarse por petición, o sus scripts
  // (sin nonce) quedarían bloqueados. Los datos se cachean aparte con unstable_cache.
  await connection();
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 pt-5 sm:pt-8">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-3xl px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-xs text-muted sm:pb-8">
          <p className="border-t border-border pt-4">
            Citas breves con fines educativos, siempre atribuidas a sus autores. ·{" "}
            <Link href="/privacidad" className="inline-flex min-h-11 items-center underline">
              Privacidad
            </Link>
          </p>
        </footer>
        <TabBar />
      </body>
    </html>
  );
}
