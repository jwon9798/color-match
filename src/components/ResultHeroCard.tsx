"use client";

import PercentileBadge from "@/components/PercentileBadge";
import ColorSwatch from "@/components/ColorSwatch";
import { GRADE_VISUAL } from "@/lib/gradeStyles";
import type { MatchGrade, RGB } from "@/lib/colorUtils";

type ResultHeroCardProps = {
  grade: MatchGrade;
  score: number;
  scoreSuffix?: string;
  label?: string;
  topPercentile?: number;
  userColor?: RGB;
  targetColor?: RGB;
  paletteSnapshot?: string;
  subtitle?: string;
  size?: "md" | "lg";
};

export default function ResultHeroCard({
  grade,
  score,
  scoreSuffix = "%",
  label,
  topPercentile,
  userColor,
  targetColor,
  paletteSnapshot,
  subtitle,
  size = "lg",
}: ResultHeroCardProps) {
  const g = GRADE_VISUAL[grade];
  const isLarge = size === "lg";

  return (
    <div className="result-hero w-full">
      <div
        className={`result-hero__card relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-1 shadow-2xl ${g.glow}`}
      >
        {paletteSnapshot && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={paletteSnapshot}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="relative rounded-[1.35rem] bg-gradient-to-b from-white/10 to-white/5 px-6 py-8 backdrop-blur-sm sm:px-8 sm:py-10">
          {subtitle && (
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              {subtitle}
            </p>
          )}

          <div className="flex flex-col items-center">
            <span
              className={`mb-4 flex items-center justify-center rounded-full font-black ring-4 ${g.bg} ${g.text} ${g.ring} ${
                isLarge ? "h-20 w-20 text-4xl" : "h-14 w-14 text-2xl"
              }`}
            >
              {grade}
            </span>

            <p
              className={`font-black tracking-tight text-white drop-shadow-lg ${
                isLarge ? "text-6xl sm:text-7xl" : "text-5xl"
              }`}
            >
              {score.toFixed(1)}
              <span className="text-3xl font-bold text-white/70">{scoreSuffix}</span>
            </p>

            {label && (
              <p className="mt-2 text-center text-base font-medium text-white/75 sm:text-lg">
                {label}
              </p>
            )}

            {topPercentile != null && (
              <div className="mt-4">
                <PercentileBadge topPercentile={topPercentile} size={isLarge ? "lg" : "md"} />
              </div>
            )}
          </div>

          {userColor && targetColor && (
            <div className="mt-8 flex items-center justify-center gap-5 sm:gap-8">
              <ColorSwatch color={userColor} label="내 색" />
              <span className="text-xl font-bold text-white/40">vs</span>
              <ColorSwatch color={targetColor} label="타겟" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
