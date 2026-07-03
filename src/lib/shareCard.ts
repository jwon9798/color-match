import { formatTopPercentile, rgbToCss, type MatchGrade, type RGB } from "./colorUtils";
import { GRADE_VISUAL } from "./gradeStyles";
import { SITE_NAME, SITE_URL } from "./siteConfig";

export type ShareCardMode = "single" | "marathon-round" | "marathon-final";

export interface ShareCardData {
  mode: ShareCardMode;
  grade: MatchGrade;
  score: number;
  targetColor: RGB;
  userColor: RGB;
  percentile?: number;
  label?: string;
  round?: number;
  totalRounds?: number;
  averageScore?: number;
  roundScores?: number[];
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawSwatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  label: string,
) {
  roundRect(ctx, x, y, size, size, 28);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, x + size / 2, y + size + 36);
}

function modeLabel(data: ShareCardData): string {
  if (data.mode === "marathon-final") return "Marathon Complete";
  if (data.mode === "marathon-round") {
    return `Round ${data.round ?? 1} / ${data.totalRounds ?? 10}`;
  }
  return "Single Challenge";
}

export function buildShareText(data: ShareCardData): string {
  const siteHost = SITE_URL.replace(/^https?:\/\//, "");
  const percentile =
    data.percentile != null ? formatTopPercentile(data.percentile) : "";

  if (data.mode === "marathon-final" && data.averageScore != null) {
    return `🎨 ${SITE_NAME} 마라톤 완주!\n평균 ${data.averageScore.toFixed(1)}점 · ${data.grade}등급${percentile ? ` · ${percentile}` : ""}\n\n나도 도전해보기 👉 ${siteHost}`;
  }

  if (data.mode === "marathon-round") {
    return `🎨 ${SITE_NAME} ${data.round}/${data.totalRounds}문제\n${data.score.toFixed(1)}% · ${data.grade}등급${percentile ? ` · ${percentile}` : ""}\n\n${siteHost}`;
  }

  return `🎨 ${SITE_NAME}\n${data.grade}등급 · ${data.score.toFixed(1)}%${percentile ? ` · ${percentile}` : ""}\n\n색감 맞춰보기 👉 ${siteHost}`;
}

export async function renderShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const g = GRADE_VISUAL[data.grade];
  const targetCss = rgbToCss(data.targetColor);
  const userCss = rgbToCss(data.userColor);

  const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
  bg.addColorStop(0, "#0f172a");
  bg.addColorStop(0.45, "#1e1b4b");
  bg.addColorStop(1, "#312e81");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1350);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.arc(900, 180, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(180, 1150, 220, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 52px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(SITE_NAME, 540, 110);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "500 28px system-ui, sans-serif";
  ctx.fillText(modeLabel(data), 540, 158);

  const cardY = 200;
  roundRect(ctx, 60, cardY, 960, 920, 40);
  const cardGrad = ctx.createLinearGradient(60, cardY, 1020, cardY + 920);
  cardGrad.addColorStop(0, g.canvasCardFrom);
  cardGrad.addColorStop(1, g.canvasCardTo);
  ctx.fillStyle = cardGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = g.canvasGrade;
  ctx.font = "900 200px system-ui, sans-serif";
  ctx.fillText(data.grade, 540, cardY + 230);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "800 72px system-ui, sans-serif";
  const scoreText =
    data.mode === "marathon-final" && data.averageScore != null
      ? `${data.averageScore.toFixed(1)}`
      : `${data.score.toFixed(1)}%`;
  ctx.fillText(scoreText, 540, cardY + 330);

  if (data.percentile != null) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "600 32px system-ui, sans-serif";
    ctx.fillText(formatTopPercentile(data.percentile), 540, cardY + 390);
  }

  if (data.label) {
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = "500 28px system-ui, sans-serif";
    ctx.fillText(data.label, 540, cardY + 440);
  }

  const swatchSize = 200;
  const swatchY = cardY + 500;
  drawSwatch(ctx, 220, swatchY, swatchSize, userCss, "My Color");
  drawSwatch(ctx, 660, swatchY, swatchSize, targetCss, "Target");

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "700 36px system-ui, sans-serif";
  ctx.fillText("vs", 540, swatchY + swatchSize / 2 + 12);

  if (data.mode === "marathon-final" && data.roundScores?.length) {
    const barW = 760;
    const barX = (1080 - barW) / 2;
    const barY = cardY + 780;
    const slotW = barW / data.roundScores.length;

    data.roundScores.forEach((score, i) => {
      const h = Math.max(8, (score / 100) * 80);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      roundRect(ctx, barX + i * slotW + 4, barY + (80 - h), slotW - 8, h, 6);
      ctx.fill();
    });

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "500 22px system-ui, sans-serif";
    ctx.fillText("Round scores", 540, barY + 110);
  }

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "500 28px system-ui, sans-serif";
  ctx.fillText(SITE_URL.replace(/^https?:\/\//, ""), 540, 1280);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "500 24px system-ui, sans-serif";
  ctx.fillText("Can you beat my score?", 540, 1320);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create image"))),
      "image/png",
      1,
    );
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function shareFilename(data: ShareCardData): string {
  const suffix =
    data.mode === "marathon-final"
      ? "marathon-final"
      : data.mode === "marathon-round"
        ? `round-${data.round ?? 1}`
        : "single";
  return `color-matcher-${suffix}-${data.grade}.png`;
}

export async function downloadShareCard(data: ShareCardData): Promise<void> {
  const blob = await renderShareCard(data);
  downloadBlob(blob, shareFilename(data));
}

export async function shareResultCard(data: ShareCardData): Promise<"shared" | "downloaded" | "copied"> {
  const blob = await renderShareCard(data);
  const text = buildShareText(data);
  const filename = shareFilename(data);
  const file = new File([blob], filename, { type: "image/png" });

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      const payload: ShareData = { title: SITE_NAME, text, files: [file] };
      if (navigator.canShare?.(payload)) {
        await navigator.share(payload);
        return "shared";
      }
      await navigator.share({ title: SITE_NAME, text });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw err;
      }
    }
  }

  downloadBlob(blob, filename);

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      /* ignore */
    }
  }

  return "downloaded";
}
