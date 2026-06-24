"use client";

import {
  BRUSH_SIZES,
  CANVAS_SIZE,
  PAINT_COLORS,
  PaintPalette,
  type BrushSizeKey,
  type PaintToolId,
} from "@/lib/paintEngine";
import type { RGB } from "@/lib/colorUtils";
import { useCallback, useEffect, useRef, useState } from "react";

export type BrushTool = PaintToolId | "blend" | "picker";

type PaletteCanvasProps = {
  tool: BrushTool;
  brushSize: BrushSizeKey;
  onColorPick: (color: RGB) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  resetKey: number;
};

export default function PaletteCanvas({
  tool,
  brushSize,
  onColorPick,
  canvasRef,
  resetKey,
}: PaletteCanvasProps) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const paletteRef = useRef<PaintPalette | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [cursor, setCursor] = useState("crosshair");

  const brush = BRUSH_SIZES[brushSize] ?? BRUSH_SIZES.medium;
  const paintRadius = brush.paint;
  const blendRadius = brush.blend;

  const render = useCallback(() => {
    const canvas = internalRef.current;
    const palette = paletteRef.current;
    if (!canvas || !palette) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    palette.render(ctx);
  }, []);

  const initPalette = useCallback(() => {
    if (!paletteRef.current) {
      paletteRef.current = new PaintPalette();
    } else {
      paletteRef.current.reset();
    }
    render();
  }, [render]);

  useEffect(() => {
    const canvas = internalRef.current;
    if (!canvas) return;

    initPalette();

    if (canvasRef && "current" in canvasRef) {
      (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current =
        canvas;
    }
  }, [resetKey, canvasRef, initPalette]);

  useEffect(() => {
    setCursor(tool === "blend" ? "grab" : "crosshair");
  }, [tool]);

  const getPos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = internalRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) return null;
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const paint = useCallback(
    (x: number, y: number) => {
      const palette = paletteRef.current;
      if (!palette || tool === "blend" || tool === "picker") return;

      const color = PAINT_COLORS[tool as PaintToolId];

      if (lastPos.current) {
        palette.applyBrushStroke(
          lastPos.current.x,
          lastPos.current.y,
          x,
          y,
          paintRadius,
          color,
        );
      } else {
        palette.applyBrush(x, y, paintRadius, color);
      }

      render();
    },
    [tool, paintRadius, render],
  );

  const smudge = useCallback(
    (x: number, y: number) => {
      const palette = paletteRef.current;
      if (!palette) return;

      if (lastPos.current) {
        const lx = lastPos.current.x;
        const ly = lastPos.current.y;
        const dist = Math.hypot(x - lx, y - ly);
        const steps = Math.max(1, Math.ceil(dist / 2.8));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const tPrev = (i - 1) / steps;
          palette.smudge(
            lx + (x - lx) * t,
            ly + (y - ly) * t,
            lx + (x - lx) * tPrev,
            ly + (y - ly) * tPrev,
            blendRadius,
          );
        }
      } else {
        palette.blendAt(x, y, blendRadius);
      }

      render();
    },
    [blendRadius, render],
  );

  const pickColor = useCallback(
    (x: number, y: number) => {
      const palette = paletteRef.current;
      if (!palette) return;

      const sampled = palette.sampleColor(x, y, Math.max(6, paintRadius * 0.5));
      if (!sampled) return;

      onColorPick(sampled);
    },
    [onColorPick, paintRadius],
  );

  const handleStart = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    ) => {
      e.preventDefault();
      const pos = getPos(e);
      if (!pos) return;

      if (tool === "picker") {
        pickColor(pos.x, pos.y);
        return;
      }

      isDrawing.current = true;
      lastPos.current = pos;

      if (tool === "blend") {
        paletteRef.current?.beginSmudge();
        smudge(pos.x, pos.y);
      } else {
        paint(pos.x, pos.y);
      }
    },
    [getPos, tool, pickColor, smudge, paint],
  );

  const handleMove = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    ) => {
      if (!isDrawing.current || tool === "picker") return;
      e.preventDefault();
      const pos = getPos(e);
      if (!pos) return;

      if (tool === "blend") {
        smudge(pos.x, pos.y);
      } else {
        paint(pos.x, pos.y);
      }
      lastPos.current = pos;
    },
    [getPos, tool, smudge, paint],
  );

  const handleEnd = useCallback(() => {
    if (tool === "blend") {
      paletteRef.current?.endSmudge();
    }
    isDrawing.current = false;
    lastPos.current = null;
  }, [tool]);

  return (
    <div className="relative w-full max-w-[320px]">
      <canvas
        ref={internalRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="aspect-square w-full max-w-[320px] touch-none rounded-2xl border-4 border-amber-800/30 shadow-lg"
        style={{ cursor }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
      <div className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-900/80 px-3 py-0.5 text-xs text-amber-100">
        팔레트
      </div>
    </div>
  );
}

export type { BrushSizeKey };
