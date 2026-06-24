import type { MatchBreakdown } from "@/lib/colorUtils";

const ROWS: { key: keyof Omit<MatchBreakdown, "deltaE">; label: string }[] = [
  { key: "lightness", label: "밝기" },
  { key: "hue", label: "색상" },
  { key: "chroma", label: "채도" },
];

type MatchBreakdownPanelProps = {
  breakdown: MatchBreakdown;
};

function barColor(value: number): string {
  if (value >= 90) return "bg-emerald-500";
  if (value >= 75) return "bg-sky-500";
  if (value >= 55) return "bg-amber-500";
  return "bg-orange-400";
}

export default function MatchBreakdownPanel({
  breakdown,
}: MatchBreakdownPanelProps) {
  return (
    <div className="w-full rounded-xl border border-amber-200/80 bg-white/90 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-amber-800">색상 분석</p>
        <p className="text-xs text-amber-600">
          ΔE{" "}
          <span className="font-mono font-semibold">
            {breakdown.deltaE.toFixed(2)}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {ROWS.map(({ key, label }) => {
          const value = breakdown[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-10 shrink-0 text-xs text-amber-700">
                {label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-amber-100">
                <div
                  className={`h-full rounded-full transition-all ${barColor(value)}`}
                  style={{ width: `${Math.min(100, value)}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-xs text-amber-800">
                {value.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-amber-600/80">
        CIEDE2000 색차(ΔE)를 0–100%로 변환한 종합 점수입니다. 밝기·색상·채도는 ΔE 구성요소별 일치도입니다.
      </p>
    </div>
  );
}
