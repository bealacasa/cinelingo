"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExploreIcon, PracticeIcon, TodayIcon } from "@/components/icons";
import { NAV_ITEMS, isActive } from "./nav-items";

const ICONS = { today: TodayIcon, practice: PracticeIcon, explore: ExploreIcon };

/** Barra de pestañas inferior (móvil), estilo iOS, respetando la barra de inicio. */
export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 sm:hidden"
    >
      <ul className="mx-auto flex max-w-md">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const Icon = ICONS[icon];
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <Icon className="size-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Navegación en la cabecera (pantallas anchas). */
export function HeaderNav() {
  const pathname = usePathname();
  return (
    <ul className="hidden items-center gap-1 rounded-full border border-border bg-surface/70 p-1 text-sm sm:flex">
      {NAV_ITEMS.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center rounded-full px-4 font-medium transition-colors ${
                active ? "bg-text text-bg" : "text-muted hover:text-text"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
