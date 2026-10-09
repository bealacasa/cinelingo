import Link from "next/link";
import { HeaderNav } from "./Nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4"
      >
        <Link href="/" className="flex min-h-11 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-xl bg-accent text-accent-contrast shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
              <path d="M4 18v-5.2C4 8.6 6.3 6 10 5l.8 1.7C8.6 7.6 7.6 9 7.5 11H10v7zm10 0v-5.2c0-4.2 2.3-6.8 6-7.8l.8 1.7c-2.2.9-3.2 2.3-3.3 4.3H20v7z" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Cine<span className="text-accent">Lingo</span>
          </span>
        </Link>
        <HeaderNav />
      </nav>
    </header>
  );
}
