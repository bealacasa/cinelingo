const PALETTES = [
  ["#7c3aed", "#a855f7"],
  ["#2563eb", "#60a5fa"],
  ["#059669", "#34d399"],
  ["#d97706", "#fbbf24"],
  ["#dc2626", "#f87171"],
  ["#0891b2", "#22d3ee"],
  ["#c026d3", "#e879f9"],
  ["#4f46e5", "#818cf8"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]![0]!.toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function CharacterAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const [from, to] = PALETTES[hash(name) % PALETTES.length]!;
  const dims = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-lg" }[size];

  return (
    <span
      className={`${dims} grid shrink-0 place-items-center rounded-full font-bold text-white shadow-sm`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
