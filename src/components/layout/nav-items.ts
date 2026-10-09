export const NAV_ITEMS = [
  { href: "/", label: "Hoy", icon: "today" },
  { href: "/explorar", label: "Explorar", icon: "explore" },
] as const;

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/cita/");
  return pathname === href || pathname.startsWith(`${href}/`);
}
