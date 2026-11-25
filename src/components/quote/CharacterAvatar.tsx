const GRADIENTS = [
  "avatar-gradient-violet",
  "avatar-gradient-blue",
  "avatar-gradient-emerald",
  "avatar-gradient-amber",
  "avatar-gradient-red",
  "avatar-gradient-cyan",
  "avatar-gradient-fuchsia",
  "avatar-gradient-indigo",
] as const;

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
  const gradient = GRADIENTS[hash(name) % GRADIENTS.length];
  const dims = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-lg" }[size];

  return (
    <span
      className={`${dims} ${gradient} grid shrink-0 place-items-center rounded-full font-bold text-white shadow-sm`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
