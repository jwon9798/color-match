import { generateAchievableTarget } from "./paintEngine";

export type RGB = { r: number; g: number; b: number };

export type Lab = { L: number; a: number; b: number };

export type OkLab = { L: number; a: number; b: number };

export type OkLch = { L: number; C: number; H: number };

export type MatchGrade = "S" | "A" | "B" | "C" | "D";

export type MatchBreakdown = {
  /** OKLab 색차 (×100 스케일) */
  deltaE: number;
  /** 밝기(L) 일치 0–100 */
  lightness: number;
  /** 색상(H) 일치 0–100 */
  hue: number;
  /** 채도(C) 일치 0–100 */
  chroma: number;
};

export type MatchEvaluation = {
  /** 종합 일치율 (소수 1자리) */
  percent: number;
  /** 추정 상위 percentile (0.5 = 상위 0.5%) */
  topPercentile: number;
  deltaE: number;
  grade: MatchGrade;
  label: string;
  breakdown: MatchBreakdown;
};

export function randomRGB(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

export function generateTarget(): RGB {
  return generateAchievableTarget();
}

export function cloneRGB(c: RGB): RGB {
  return { r: c.r, g: c.g, b: c.b };
}

export function rgbToCss({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

function srgbChannelToLinear(v: number): number {
  const c = v / 255;
  return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
}

function linearToSrgbChannel(v: number): number {
  const c = Math.max(0, Math.min(1, v));
  return c <= 0.0031308
    ? Math.round(12.92 * c * 255)
    : Math.round((1.055 * c ** (1 / 2.4) - 0.055) * 255);
}

export function rgbToLab({ r, g, b }: RGB): Lab {
  let lr = srgbChannelToLinear(r);
  let lg = srgbChannelToLinear(g);
  let lb = srgbChannelToLinear(b);

  let x = (lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375) / 0.95047;
  let y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175;
  let z = (lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041) / 1.08883;

  const f = (t: number) =>
    t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116;

  x = f(x);
  y = f(y);
  z = f(z);

  return { L: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

export function labToRgb({ L, a, b }: Lab): RGB {
  let y = (L + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const finv = (t: number) => {
    const t3 = t ** 3;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };

  x = finv(x) * 0.95047;
  y = finv(y);
  z = finv(z) * 1.08883;

  const lr = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const lg = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  const lb = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  return {
    r: linearToSrgbChannel(lr),
    g: linearToSrgbChannel(lg),
    b: linearToSrgbChannel(lb),
  };
}

/** OKLab — 지각적으로 균일한 색공간 (Björn Ottosson) */
export function rgbToOklab({ r, g, b }: RGB): OkLab {
  const lr = srgbChannelToLinear(r);
  const lg = srgbChannelToLinear(g);
  const lb = srgbChannelToLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

export function oklabToOklch({ L, a, b }: OkLab): OkLch {
  const C = Math.hypot(a, b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

export function rgbToOklch(rgb: RGB): OkLch {
  return oklabToOklch(rgbToOklab(rgb));
}

function oklabDistance(a: OkLab, b: OkLab): number {
  return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b);
}

function hueDifferenceDeg(h1: number, h2: number): number {
  let dh = Math.abs(h1 - h2);
  if (dh > 180) dh = 360 - dh;
  return dh;
}

/** OKLCH L 차이 → 0–100 */
const OKLCH_L_ANCHORS: readonly [number, number][] = [
  [0, 100],
  [0.005, 98],
  [0.01, 95],
  [0.02, 88],
  [0.03, 82],
  [0.05, 72],
  [0.07, 62],
  [0.1, 48],
  [0.15, 28],
  [0.2, 15],
  [0.3, 4],
  [0.5, 0],
];

/** OKLCH C 차이 → 0–100 */
const OKLCH_C_ANCHORS: readonly [number, number][] = [
  [0, 100],
  [0.008, 97],
  [0.015, 93],
  [0.025, 86],
  [0.04, 76],
  [0.06, 64],
  [0.08, 54],
  [0.12, 38],
  [0.18, 20],
  [0.25, 8],
  [0.35, 0],
];

/** 색상각 차이(°) → 0–100 — 채도 가중 적용 후 */
const OKLCH_H_ANCHORS: readonly [number, number][] = [
  [0, 100],
  [3, 97],
  [6, 93],
  [10, 87],
  [15, 78],
  [20, 70],
  [30, 55],
  [45, 38],
  [60, 24],
  [90, 8],
  [120, 2],
  [180, 0],
];

const LOW_CHROMA = 0.02;
const MID_CHROMA = 0.08;

type MatchWeights = { lightness: number; hue: number; chroma: number };

function getMatchWeights(avgChroma: number): MatchWeights {
  if (avgChroma < LOW_CHROMA) {
    return { lightness: 0.6, chroma: 0.3, hue: 0.1 };
  }
  if (avgChroma < MID_CHROMA) {
    return { lightness: 0.35, chroma: 0.25, hue: 0.4 };
  }
  return { lightness: 0.3, chroma: 0.15, hue: 0.55 };
}

function interpolateAnchors(value: number, anchors: readonly [number, number][]): number {
  if (value <= anchors[0][0]) return anchors[0][1];
  const last = anchors[anchors.length - 1];
  if (value >= last[0]) return last[1];

  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (value >= x0 && value <= x1) {
      const t = (value - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return 0;
}

function analyzeOklchMatch(submitted: OkLch, target: OkLch) {
  const dL = Math.abs(submitted.L - target.L);
  const dC = Math.abs(submitted.C - target.C);
  const avgChroma = (submitted.C + target.C) / 2;
  const minChroma = Math.min(submitted.C, target.C);
  const maxChroma = Math.max(submitted.C, target.C, 1e-6);

  const rawHueDiff = hueDifferenceDeg(submitted.H, target.H);
  const chromaFactor = minChroma / maxChroma;
  const effectiveHueDiff =
    avgChroma < LOW_CHROMA ? 0 : rawHueDiff * chromaFactor;

  const lightnessScore = interpolateAnchors(dL, OKLCH_L_ANCHORS);
  const chromaScore = interpolateAnchors(dC, OKLCH_C_ANCHORS);
  const hueScore =
    avgChroma < LOW_CHROMA
      ? 100
      : interpolateAnchors(effectiveHueDiff, OKLCH_H_ANCHORS);

  const weights = getMatchWeights(avgChroma);
  const percent =
    lightnessScore * weights.lightness +
    hueScore * weights.hue +
    chromaScore * weights.chroma;

  return {
    dL,
    dC,
    effectiveHueDiff,
    avgChroma,
    weights,
    percent,
    lightnessScore,
    hueScore,
    chromaScore,
  };
}

function analyzeMatch(submitted: RGB, target: RGB) {
  const oklabS = rgbToOklab(submitted);
  const oklabT = rgbToOklab(target);
  const oklchS = oklabToOklch(oklabS);
  const oklchT = oklabToOklch(oklabT);
  const analysis = analyzeOklchMatch(oklchS, oklchT);
  const distance = oklabDistance(oklabS, oklabT);

  return {
    ...analysis,
    distance,
    breakdown: {
      deltaE: Math.round(distance * 1000) / 10,
      lightness: Math.round(analysis.lightnessScore * 10) / 10,
      hue: Math.round(analysis.hueScore * 10) / 10,
      chroma: Math.round(analysis.chromaScore * 10) / 10,
    },
  };
}

export function getMatchGrade(percent: number, _deltaE?: number): MatchGrade {
  return getMatchGradeFromPercent(percent);
}

/** 평균 점수만 있을 때 (마라톤 최종 등) */
export function getMatchGradeFromPercent(percent: number): MatchGrade {
  if (!Number.isFinite(percent)) return "D";
  if (percent >= 94) return "S";
  if (percent >= 86) return "A";
  if (percent >= 70) return "B";
  if (percent >= 45) return "C";
  return "D";
}

export function getMatchLabel(percent: number, _deltaE?: number): string {
  if (percent >= 98) return "완벽한 색감!";
  if (percent >= 94) return "거의 구분 안 돼요!";
  if (percent >= 90) return "아주 비슷해요!";
  if (percent >= 80) return "꽤 가까워요";
  if (percent >= 65) return "조금 더 섞어보세요?";
  if (percent >= 45) return "색감 차이가 있어요";
  return "다시 도전해보세요!";
}

/** 점수 → 추정 상위 percentile (플레이어 분포 모델) */
const SCORE_TO_TOP_PERCENTILE: readonly [score: number, topPct: number][] = [
  [100, 0.5],
  [98, 1.2],
  [94, 4],
  [90, 7],
  [86, 11],
  [80, 18],
  [70, 30],
  [60, 42],
  [50, 55],
  [45, 62],
  [35, 75],
  [25, 86],
  [15, 94],
  [5, 98.5],
  [0, 99.5],
];

function interpolateAnchorsDesc(
  value: number,
  anchors: readonly [number, number][],
): number {
  if (value >= anchors[0][0]) return anchors[0][1];
  const last = anchors[anchors.length - 1];
  if (value <= last[0]) return last[1];

  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (value <= x0 && value >= x1) {
      const t = (x0 - value) / (x0 - x1);
      return y0 + (y1 - y0) * t;
    }
  }
  return last[1];
}

/** 점수(0–100)에 대한 추정 상위 percentile — 낮을수록 상위권 */
export function getTopPercentile(percent: number): number {
  const raw = interpolateAnchorsDesc(
    Math.max(0, Math.min(100, percent)),
    SCORE_TO_TOP_PERCENTILE,
  );
  return Math.round(raw * 10) / 10;
}

/** UI용 상위 percentile 문구 */
export function formatTopPercentile(topPercentile: number): string {
  if (!Number.isFinite(topPercentile)) return "";
  if (topPercentile < 1) return "상위 1% 미만";
  if (topPercentile < 10) {
    const rounded = Math.round(topPercentile * 10) / 10;
    return Number.isInteger(rounded)
      ? `상위 ${rounded}%`
      : `상위 ${rounded.toFixed(1)}%`;
  }
  return `상위 ${Math.round(topPercentile)}%`;
}

export function evaluateMatch(submitted: RGB, target: RGB): MatchEvaluation {
  const analysis = analyzeMatch(submitted, target);

  const percent =
    Math.round(Math.max(0, Math.min(100, analysis.percent)) * 10) / 10;
  const topPercentile = getTopPercentile(percent);

  return {
    percent,
    topPercentile,
    deltaE: analysis.breakdown.deltaE,
    grade: getMatchGradeFromPercent(percent),
    label: getMatchLabel(percent),
    breakdown: analysis.breakdown,
  };
}

/** @deprecated evaluateMatch 사용 */
export function similarityPercent(submitted: RGB, target: RGB): number {
  return evaluateMatch(submitted, target).percent;
}

export function colorDistance(a: RGB, b: RGB): number {
  return oklabDistance(rgbToOklab(a), rgbToOklab(b));
}

export function deltaEToPercent(deltaE: number): number {
  return Math.round(interpolateAnchors(deltaE / 100, OKLCH_L_ANCHORS));
}

/** CIEDE2000 — 참고용 (UI 외부) */
export function deltaE2000(l1: Lab, l2: Lab): number {
  if (
    Math.abs(l1.L - l2.L) < 1e-6 &&
    Math.abs(l1.a - l2.a) < 1e-6 &&
    Math.abs(l1.b - l2.b) < 1e-6
  ) {
    return 0;
  }

  const avgLp = (l1.L + l2.L) / 2;
  const c1 = Math.hypot(l1.a, l1.b);
  const c2 = Math.hypot(l2.a, l2.b);
  const avgC = (c1 + c2) / 2;

  const g =
    0.5 * (1 - Math.sqrt(avgC ** 7 / (avgC ** 7 + 25 ** 7)));

  const a1p = l1.a * (1 + g);
  const a2p = l2.a * (1 + g);
  const c1p = Math.hypot(a1p, l1.b);
  const c2p = Math.hypot(a2p, l2.b);
  const avgCp = (c1p + c2p) / 2;

  const h1p = Math.atan2(l1.b, a1p) * (180 / Math.PI);
  const h2p = Math.atan2(l2.b, a2p) * (180 / Math.PI);
  const h1 = h1p < 0 ? h1p + 360 : h1p;
  const h2 = h2p < 0 ? h2p + 360 : h2p;

  let dhp = h2 - h1;
  if (dhp > 180) dhp -= 360;
  if (dhp < -180) dhp += 360;

  const dLp = l2.L - l1.L;
  const dCp = c2p - c1p;
  const dHp = 2 * Math.sqrt(c1p * c2p) * Math.sin((dhp * Math.PI) / 360);

  let avgHp = h1 + h2;
  if (Math.abs(h1 - h2) > 180) avgHp += 360;
  avgHp /= 2;

  const t =
    1 -
    0.17 * Math.cos(((avgHp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * avgHp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * avgHp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * avgHp - 63) * Math.PI) / 180);

  const dRo = 30 * Math.exp(-(((avgHp - 275) / 25) ** 2));
  const rc = 2 * Math.sqrt(avgCp ** 7 / (avgCp ** 7 + 25 ** 7));
  const rt = -Math.sin((2 * dRo * Math.PI) / 180) * rc;

  const sl = 1 + (0.015 * (avgLp - 50) ** 2) / Math.sqrt(20 + (avgLp - 50) ** 2);
  const sc = 1 + 0.045 * avgCp;
  const sh = 1 + 0.015 * avgCp * t;

  const de = Math.sqrt(
    (dLp / sl) ** 2 +
      (dCp / sc) ** 2 +
      (dHp / sh) ** 2 +
      rt * (dCp / sc) * (dHp / sh),
  );

  return Number.isFinite(de) ? Math.max(0, de) : 0;
}
