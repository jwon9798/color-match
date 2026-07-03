import { formatTopPercentile } from "@/lib/colorUtils";

type PercentileBadgeProps = {
  topPercentile: number;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASS = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
} as const;

export default function PercentileBadge({
  topPercentile,
  size = "md",
}: PercentileBadgeProps) {
  const label = formatTopPercentile(topPercentile);
  if (!label) return null;

  const isElite = topPercentile <= 5;
  const isStrong = topPercentile <= 15;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold ring-1 ${SIZE_CLASS[size]} ${
        isElite
          ? "bg-amber-400/90 text-amber-950 ring-amber-500/50"
          : isStrong
            ? "bg-sky-100 text-sky-900 ring-sky-300/60"
            : "bg-stone-100 text-stone-700 ring-stone-300/60"
      }`}
    >
      <span aria-hidden>{isElite ? "🏆" : "📊"}</span>
      {label}
    </span>
  );
}
