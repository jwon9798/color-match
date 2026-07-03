import type { MatchGrade } from "./colorUtils";

export type GradeVisual = {
  bg: string;
  text: string;
  ring: string;
  glow: string;
  canvasCardFrom: string;
  canvasCardTo: string;
  canvasGrade: string;
};

export const GRADE_VISUAL: Record<MatchGrade, GradeVisual> = {
  S: {
    bg: "bg-amber-400",
    text: "text-amber-950",
    ring: "ring-amber-300",
    glow: "shadow-[0_0_48px_rgba(251,191,36,0.55)]",
    canvasCardFrom: "rgba(251,191,36,0.35)",
    canvasCardTo: "rgba(245,158,11,0.12)",
    canvasGrade: "#FBBF24",
  },
  A: {
    bg: "bg-emerald-400",
    text: "text-emerald-950",
    ring: "ring-emerald-300",
    glow: "shadow-[0_0_42px_rgba(52,211,153,0.45)]",
    canvasCardFrom: "rgba(52,211,153,0.32)",
    canvasCardTo: "rgba(16,185,129,0.1)",
    canvasGrade: "#34D399",
  },
  B: {
    bg: "bg-sky-400",
    text: "text-sky-950",
    ring: "ring-sky-300",
    glow: "shadow-[0_0_38px_rgba(56,189,248,0.4)]",
    canvasCardFrom: "rgba(56,189,248,0.3)",
    canvasCardTo: "rgba(14,165,233,0.1)",
    canvasGrade: "#38BDF8",
  },
  C: {
    bg: "bg-orange-300",
    text: "text-orange-950",
    ring: "ring-orange-200",
    glow: "shadow-[0_0_34px_rgba(253,186,116,0.4)]",
    canvasCardFrom: "rgba(253,186,116,0.32)",
    canvasCardTo: "rgba(249,115,22,0.1)",
    canvasGrade: "#FDBA74",
  },
  D: {
    bg: "bg-stone-300",
    text: "text-stone-800",
    ring: "ring-stone-200",
    glow: "shadow-[0_0_30px_rgba(168,162,158,0.35)]",
    canvasCardFrom: "rgba(214,211,209,0.28)",
    canvasCardTo: "rgba(120,113,108,0.1)",
    canvasGrade: "#D6D3D1",
  },
};

export function gradeClass(grade: MatchGrade, part: keyof GradeVisual): string {
  return GRADE_VISUAL[grade][part] as string;
}
