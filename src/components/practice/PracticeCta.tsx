import Link from "next/link";
import { ChevronIcon, PracticeIcon } from "@/components/icons";

/** Acceso a la práctica de una cita, justo debajo de la tarjeta. */
export function PracticeCta({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="mt-4 flex min-h-14 items-center gap-3 rounded-2xl bg-accent px-5 font-semibold text-accent-contrast shadow-sm transition-transform active:scale-[0.99]"
    >
      <PracticeIcon className="size-6" />
      <span className="flex-1">
        Practicar esta cita
        <span className="block text-sm font-normal">
          ¿Quién lo dijo?, significado, huecos… · 3 min
        </span>
      </span>
      <ChevronIcon className="size-5" />
    </Link>
  );
}
