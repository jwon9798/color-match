import { generateAchievableTarget } from "./paintEngine";

export type RGB = { r: number; g: number; b: number };

export type Lab = { L: number; a: number; b: number };

export type MatchGrade = "S" | "A" | "B" | "C" | "D";

export type MatchBreakdown = {
  /** CIEDE2000 색차 */
  deltaE: number;
  /** 밝기(L*) 일치 0–100 */
  lightness: number;
  /** 색상(Hue) 일치 0–100 */
  hue: number;
  /** 채도(Chroma) 일치 0–100 */
  chroma: number;
};

export type MatchEvaluation = {
  /** 종합 일치율 (소수 1자리) */
  percent: number;
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

/** CIEDE2000 — 국제 표준 색차 공식 */
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

/** ΔE 앵커 보간 — 색차학 기준점 기반 (애매한 지수식 대신) */
const DE_ANCHORS: readonly [de: number, score: number][] = [
  [0, 100],
  [0.5, 99.5],
  [1, 98.5], // 육안 거의 구분 불가
  [2, 96], // 근접 관찰 시 차이
  [2.3, 94.5], // JND (Just Noticeable Difference)
  [3.5, 91],
  [5, 87], // 한눈에 약간 다름
  [7, 81],
  [10, 72], // 확실히 다름
  [15, 58],
  [20, 46],
  [25, 36],
  [30, 28],
  [40, 15],
  [50, 8],
  [75, 2],
  [100, 0],
];

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

function componentScore(diff: number, noticeableAt: number, power = 1.15): number {
  const t = Math.min(1, Math.max(0, diff / noticeableAt));
  return 100 * (1 - t ** power);
}

function hueDifferenceDeg(lab1: Lab, lab2: Lab): number {
  const c1 = Math.hypot(lab1.a, lab1.b);
  const c2 = Math.hypot(lab2.a, lab2.b);
  if (c1 < 1.5 && c2 < 1.5) return 0;

  const h1 = Math.atan2(lab1.b, lab1.a);
  const h2 = Math.atan2(lab2.b, lab2.a);
  let dh = Math.abs(h1 - h2) * (180 / Math.PI);
  if (dh > 180) dh = 360 - dh;
  return dh;
}

function analyzeComponents(submitted: Lab, target: Lab) {
  const deltaE = deltaE2000(submitted, target);
  const dL = Math.abs(submitted.L - target.L);
  const cS = Math.hypot(submitted.a, submitted.b);
  const cT = Math.hypot(target.a, target.b);
  const dC = Math.abs(cS - cT);
  const dH = hueDifferenceDeg(submitted, target);

  const deltaEScore = interpolateAnchors(deltaE, DE_ANCHORS);
  const lightnessScore = componentScore(dL, 10, 1.2);
  const hueScore = componentScore(dH, 12, 1.05);
  const chromaScore = componentScore(dC, 16, 1.1);

  return {
    deltaE,
    deltaEScore,
    lightnessScore,
    hueScore,
    chromaScore,
    breakdown: {
      deltaE: Math.round(deltaE * 100) / 100,
      lightness: Math.round(lightnessScore * 10) / 10,
      hue: Math.round(hueScore * 10) / 10,
      chroma: Math.round(chromaScore * 10) / 10,
    },
  };
}

export function getMatchGrade(percent: number, deltaE: number): MatchGrade {
  if (!Number.isFinite(percent)) return "D";
  if (deltaE <= 2.3 && percent >= 94) return "S";
  if (deltaE <= 5 && percent >= 86) return "A";
  if (deltaE <= 10 && percent >= 70) return "B";
  if (deltaE <= 20 && percent >= 45) return "C";
  return "D";
}

export function getMatchLabel(percent: number, deltaE: number): string {
  if (deltaE <= 1) return "완벽한 색감!";
  if (deltaE <= 2.3) return "거의 구분 안 돼요!";
  if (percent >= 90) return "아주 비슷해요!";
  if (percent >= 80) return "꽤 가까워요";
  if (percent >= 65) return "조금 더 섞어볼까요?";
  if (percent >= 45) return "색감 차이가 있어요";
  return "다시 도전해보세요!";
}

export function evaluateMatch(submitted: RGB, target: RGB): MatchEvaluation {
  const labS = rgbToLab(submitted);
  const labT = rgbToLab(target);
  const analysis = analyzeComponents(labS, labT);

  const raw =
    analysis.deltaEScore * 0.5 +
    analysis.lightnessScore * 0.25 +
    analysis.hueScore * 0.15 +
    analysis.chromaScore * 0.1;

  const percent = Math.round(Math.max(0, Math.min(100, raw)) * 10) / 10;

  return {
    percent,
    deltaE: analysis.breakdown.deltaE,
    grade: getMatchGrade(percent, analysis.deltaE),
    label: getMatchLabel(percent, analysis.deltaE),
    breakdown: analysis.breakdown,
  };
}

/** @deprecated evaluateMatch 사용 */
export function similarityPercent(submitted: RGB, target: RGB): number {
  return evaluateMatch(submitted, target).percent;
}

export function colorDistance(a: RGB, b: RGB): number {
  return deltaE2000(rgbToLab(a), rgbToLab(b));
}

export function deltaEToPercent(deltaE: number): number {
  return Math.round(interpolateAnchors(deltaE, DE_ANCHORS));
}
