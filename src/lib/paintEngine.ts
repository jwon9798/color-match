import type { RGB } from "./colorUtils";

export const PALETTE_BG: RGB = { r: 245, g: 240, b: 232 };

const MIN_WET = 0.055;

const W = 320;
const H = 320;

const K5 = [
  [1, 4, 7, 4, 1],
  [4, 16, 26, 16, 4],
  [7, 26, 41, 26, 7],
  [4, 16, 26, 16, 4],
  [1, 4, 7, 4, 1],
];
const K5SUM = 273;

export type PaintToolId = "paint-r" | "paint-g" | "paint-b" | "paint-w";

type Lab = { L: number; a: number; b: number };

function rgbToLab(r: number, g: number, b: number): Lab {
  let lr = r / 255;
  let lg = g / 255;
  let lb = b / 255;

  lr = lr > 0.04045 ? ((lr + 0.055) / 1.055) ** 2.4 : lr / 12.92;
  lg = lg > 0.04045 ? ((lg + 0.055) / 1.055) ** 2.4 : lg / 12.92;
  lb = lb > 0.04045 ? ((lb + 0.055) / 1.055) ** 2.4 : lb / 12.92;

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

function labToRgb(L: number, a: number, b: number): RGB {
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

  let lr = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let lg = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  let lb = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  const toSrgb = (c: number) => {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308
      ? Math.round(12.92 * c * 255)
      : Math.round((1.055 * c ** (1 / 2.4) - 0.055) * 255);
  };

  return { r: toSrgb(lr), g: toSrgb(lg), b: toSrgb(lb) };
}

/** LAB 보간 — 부드럽고 자연스러운 중간색 */
export function mixPaint(a: RGB, b: RGB, t: number): RGB {
  const w = Math.max(0, Math.min(1, t));
  const la = rgbToLab(a.r, a.g, a.b);
  const lb = rgbToLab(b.r, b.g, b.b);
  return labToRgb(
    la.L + (lb.L - la.L) * w,
    la.a + (lb.a - la.a) * w,
    la.b + (lb.b - la.b) * w,
  );
}

function mixByVolume(cA: RGB, vA: number, cB: RGB, vB: number): RGB {
  const total = vA + vB;
  if (total < 1e-6) return cB;
  return mixPaint(cA, cB, vB / total);
}

/** R·G·B·W 물감 비율로 LAB 공간에서 혼합한 색 (팔레트로 만들 수 있는 색) */
export function mixPaintsWeighted(
  weights: Partial<Record<PaintToolId, number>>,
): RGB {
  const ids: PaintToolId[] = ["paint-r", "paint-g", "paint-b", "paint-w"];
  let total = 0;
  let L = 0;
  let a = 0;
  let b = 0;

  for (const id of ids) {
    const w = Math.max(0, weights[id] ?? 0);
    if (w <= 0) continue;
    const c = PAINT_COLORS[id];
    const lab = rgbToLab(c.r, c.g, c.b);
    L += lab.L * w;
    a += lab.a * w;
    b += lab.b * w;
    total += w;
  }

  if (total < 1e-6) {
    return { ...PAINT_COLORS["paint-w"] };
  }

  return labToRgb(L / total, a / total, b / total);
}

function randomPaintWeights(): Record<PaintToolId, number> {
  const weights: Record<PaintToolId, number> = {
    "paint-r": Math.random() ** (0.35 + Math.random() * 0.65),
    "paint-g": Math.random() ** (0.35 + Math.random() * 0.65),
    "paint-b": Math.random() ** (0.35 + Math.random() * 0.65),
    "paint-w": Math.random() ** (0.25 + Math.random() * 0.9),
  };

  if (Math.random() < 0.75) {
    const primary = (["paint-r", "paint-g", "paint-b"] as PaintToolId[])[
      Math.floor(Math.random() * 3)
    ];
    weights[primary] += 0.4 + Math.random() * 0.8;
  }

  if (Math.random() < 0.6) {
    weights["paint-w"] *= 0.3 + Math.random() * 0.7;
  }

  return weights;
}

/** R·G·B·W 팔레트로 만들 수 있는 타겟 색 생성 */
export function generateAchievableTarget(): RGB {
  const mixed = mixPaintsWeighted(randomPaintWeights());
  return {
    r: Math.round(mixed.r),
    g: Math.round(mixed.g),
    b: Math.round(mixed.b),
  };
}

function brushFalloff(dist: number, radius: number): number {
  if (dist >= radius) return 0;
  const t = 1 - dist / radius;
  return t * t;
}

function isPaint(w: number): boolean {
  return w >= MIN_WET;
}

export type BrushSizeKey = "small" | "medium" | "large";

export const BRUSH_SIZES: Record<
  BrushSizeKey,
  { paint: number; blend: number; dot: number }
> = {
  small: { paint: 10, blend: 22, dot: 8 },
  medium: { paint: 18, blend: 34, dot: 14 },
  large: { paint: 28, blend: 48, dot: 22 },
};

type WetSample = { color: RGB; wetness: number };

export class PaintPalette {
  readonly width = W;
  readonly height = H;

  private colorR = new Float32Array(W * H);
  private colorG = new Float32Array(W * H);
  private colorB = new Float32Array(W * H);
  private wetness = new Float32Array(W * H);
  private smudgeCarry: WetSample | null = null;

  reset() {
    this.colorR.fill(PALETTE_BG.r);
    this.colorG.fill(PALETTE_BG.g);
    this.colorB.fill(PALETTE_BG.b);
    this.wetness.fill(0);
    this.smudgeCarry = null;
  }

  constructor() {
    this.reset();
  }

  beginSmudge() {
    this.smudgeCarry = null;
  }

  endSmudge() {
    this.smudgeCarry = null;
  }

  private sampleWetCircle(cx: number, cy: number, radius: number): WetSample | null {
    const r = Math.ceil(radius);
    const sx = Math.max(0, Math.floor(cx - r));
    const sy = Math.max(0, Math.floor(cy - r));
    const ex = Math.min(this.width - 1, Math.floor(cx + r));
    const ey = Math.min(this.height - 1, Math.floor(cy + r));

    let tr = 0;
    let tg = 0;
    let tb = 0;
    let tw = 0;

    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const falloff = brushFalloff(Math.hypot(x - cx, y - cy), radius);
        if (falloff < 0.02) continue;
        const i = y * this.width + x;
        const pw = this.wetness[i];
        if (!isPaint(pw)) continue;
        const w = pw * falloff;
        tr += this.colorR[i] * w;
        tg += this.colorG[i] * w;
        tb += this.colorB[i] * w;
        tw += w;
      }
    }

    if (tw < MIN_WET * 0.35) return null;

    return {
      color: { r: tr / tw, g: tg / tw, b: tb / tw },
      wetness: Math.min(1, tw / (radius * 0.15)),
    };
  }

  private deposit(
    x: number,
    y: number,
    radius: number,
    color: RGB,
    amount: number,
  ) {
    const r = Math.ceil(radius);
    const sx = Math.max(0, Math.floor(x - r));
    const sy = Math.max(0, Math.floor(y - r));
    const ex = Math.min(this.width - 1, Math.floor(x + r));
    const ey = Math.min(this.height - 1, Math.floor(y + r));

    for (let py = sy; py <= ey; py++) {
      for (let px = sx; px <= ex; px++) {
        const falloff = brushFalloff(Math.hypot(px - x, py - y), radius);
        if (falloff < 0.015) continue;

        const i = py * this.width + px;
        const add = amount * falloff;
        const w = this.wetness[i];

        if (!isPaint(w)) {
          this.colorR[i] = color.r;
          this.colorG[i] = color.g;
          this.colorB[i] = color.b;
          this.wetness[i] = Math.min(1, add);
        } else {
          const cur: RGB = {
            r: this.colorR[i],
            g: this.colorG[i],
            b: this.colorB[i],
          };
          const mixed = mixByVolume(cur, w, color, add);
          this.colorR[i] = mixed.r;
          this.colorG[i] = mixed.g;
          this.colorB[i] = mixed.b;
          this.wetness[i] = Math.min(1, w + add * 0.35);
        }
      }
    }
  }

  applyBrush(x: number, y: number, radius: number, color: RGB) {
    this.deposit(x, y, radius, color, 0.42);
  }

  applyBrushStroke(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    radius: number,
    color: RGB,
  ) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / 2.5));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      this.deposit(
        x0 + (x1 - x0) * t,
        y0 + (y1 - y0) * t,
        radius,
        color,
        0.38,
      );
    }
  }

  /** 한 지점에 부드럽게 번짐 — 과하지 않게 1패스 */
  private softDiffuse(cx: number, cy: number, radius: number, strength: number) {
    const r = Math.ceil(radius) + 2;
    const sx = Math.max(2, Math.floor(cx - r));
    const sy = Math.max(2, Math.floor(cy - r));
    const ex = Math.min(this.width - 3, Math.floor(cx + r));
    const ey = Math.min(this.height - 3, Math.floor(cy + r));

    const tR = new Float32Array(this.width * this.height);
    const tG = new Float32Array(this.width * this.height);
    const tB = new Float32Array(this.width * this.height);
    const tW = new Float32Array(this.width * this.height);
    tR.set(this.colorR);
    tG.set(this.colorG);
    tB.set(this.colorB);
    tW.set(this.wetness);

    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const falloff = brushFalloff(Math.hypot(x - cx, y - cy), radius);
        if (falloff < 0.05) continue;

        const i = y * this.width + x;
        const w = tW[i];
        if (!isPaint(w)) continue;

        let sr = 0;
        let sg = 0;
        let sb = 0;
        let sw = 0;

        for (let ky = 0; ky < 5; ky++) {
          for (let kx = 0; kx < 5; kx++) {
            const ni = (y + ky - 2) * this.width + (x + kx - 2);
            const nw = tW[ni];
            if (!isPaint(nw)) continue;
            const kw = (K5[ky][kx] / K5SUM) * nw;
            sr += tR[ni] * kw;
            sg += tG[ni] * kw;
            sb += tB[ni] * kw;
            sw += kw;
          }
        }

        if (sw < 0.01) continue;

        const avg: RGB = { r: sr / sw, g: sg / sw, b: sb / sw };
        const cur: RGB = { r: tR[i], g: tG[i], b: tB[i] };
        const t = strength * falloff * 0.55;
        const mixed = mixPaint(cur, avg, t);

        this.colorR[i] = mixed.r;
        this.colorG[i] = mixed.g;
        this.colorB[i] = mixed.b;
      }
    }
  }

  private stampColor(
    cx: number,
    cy: number,
    radius: number,
    sample: WetSample,
    strength: number,
  ) {
    const r = Math.ceil(radius);
    const sx = Math.max(0, Math.floor(cx - r));
    const sy = Math.max(0, Math.floor(cy - r));
    const ex = Math.min(this.width - 1, Math.floor(cx + r));
    const ey = Math.min(this.height - 1, Math.floor(cy + r));

    for (let py = sy; py <= ey; py++) {
      for (let px = sx; px <= ex; px++) {
        const falloff = brushFalloff(Math.hypot(px - cx, py - cy), radius);
        if (falloff < 0.02) continue;

        const i = py * this.width + px;
        const w = this.wetness[i];
        const amt = strength * falloff * sample.wetness;

        if (!isPaint(w)) {
          this.colorR[i] = sample.color.r;
          this.colorG[i] = sample.color.g;
          this.colorB[i] = sample.color.b;
          this.wetness[i] = Math.min(1, amt * 0.7 + 0.08);
        } else {
          const cur: RGB = {
            r: this.colorR[i],
            g: this.colorG[i],
            b: this.colorB[i],
          };
          const mixed = mixByVolume(cur, w, sample.color, amt);
          this.colorR[i] = mixed.r;
          this.colorG[i] = mixed.g;
          this.colorB[i] = mixed.b;
          this.wetness[i] = Math.min(1, w + amt * 0.2);
        }
      }
    }
  }

  smudge(x: number, y: number, lastX: number, lastY: number, radius: number) {
    const dx = x - lastX;
    const dy = y - lastY;
    const len = Math.hypot(dx, dy);

    if (len < 0.6) {
      this.softDiffuse(x, y, radius, 0.42);
      return;
    }

    const nx = dx / len;
    const ny = dy / len;
    const pull = Math.min(radius * 0.55, len * 0.65);

    const finger = this.sampleWetCircle(x, y, radius * 0.85);
    const drag = this.sampleWetCircle(
      x - nx * pull,
      y - ny * pull,
      radius * 0.9,
    );

    let paint: WetSample | null = null;

    if (drag) {
      paint = drag;
      if (this.smudgeCarry) {
        paint = {
          color: mixPaint(this.smudgeCarry.color, drag.color, 0.35),
          wetness: Math.max(this.smudgeCarry.wetness, drag.wetness),
        };
      }
    } else if (finger) {
      paint = finger;
    } else if (this.smudgeCarry) {
      paint = this.smudgeCarry;
    }

    if (!paint) return;

    this.smudgeCarry = paint;
    this.stampColor(x, y, radius, paint, 0.72);
    this.softDiffuse(x, y, radius + 3, 0.48);
  }

  /** 정지 상태에서 경계만 부드럽게 */
  blendAt(x: number, y: number, radius: number) {
    this.softDiffuse(x, y, radius, 0.5);
  }

  sampleColor(x: number, y: number, radius = 8): RGB | null {
    const s = this.sampleWetCircle(x, y, radius);
    if (!s) return null;
    return {
      r: Math.round(s.color.r),
      g: Math.round(s.color.g),
      b: Math.round(s.color.b),
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    const imageData = ctx.createImageData(this.width, this.height);
    const d = imageData.data;

    for (let i = 0; i < this.width * this.height; i++) {
      const w = this.wetness[i];
      const pi = i * 4;

      if (!isPaint(w)) {
        d[pi] = PALETTE_BG.r;
        d[pi + 1] = PALETTE_BG.g;
        d[pi + 2] = PALETTE_BG.b;
        d[pi + 3] = 255;
      } else {
        d[pi] = Math.round(this.colorR[i]);
        d[pi + 1] = Math.round(this.colorG[i]);
        d[pi + 2] = Math.round(this.colorB[i]);
        d[pi + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

export const CANVAS_SIZE = W;

export const PAINT_COLORS: Record<PaintToolId, RGB> = {
  "paint-r": { r: 220, g: 45, b: 45 },
  "paint-g": { r: 45, g: 175, b: 65 },
  "paint-b": { r: 45, g: 95, b: 215 },
  "paint-w": { r: 252, g: 252, b: 250 },
};
