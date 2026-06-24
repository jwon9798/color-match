"use client";

import AdSlot from "@/components/AdSlot";
import ColorSwatch from "@/components/ColorSwatch";
import MatchBreakdownPanel from "@/components/MatchBreakdownPanel";
import PaletteCanvas, {
  type BrushSizeKey,
  type BrushTool,
} from "@/components/PaletteCanvas";
import {
  averageScore,
  GAME_MODES,
  type GameModeId,
} from "@/lib/gameModes";
import {
  cloneRGB,
  evaluateMatch,
  generateTarget,
  getMatchGrade,
  getMatchGradeFromPercent,
  rgbToCss,
  type MatchEvaluation,
  type MatchGrade,
  type RGB,
} from "@/lib/colorUtils";
import { BRUSH_SIZES } from "@/lib/paintEngine";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const TOOLS: { id: BrushTool; label: string; color?: string; icon: string }[] = [
  { id: "paint-r", label: "R", color: "#dc3232", icon: "🔴" },
  { id: "paint-g", label: "G", color: "#32b446", icon: "🟢" },
  { id: "paint-b", label: "B", color: "#3264dc", icon: "🔵" },
  { id: "paint-w", label: "W", color: "#f0f0ee", icon: "⚪" },
  { id: "blend", label: "Blend", icon: "🖌️" },
  { id: "picker", label: "Pick", icon: "💧" },
];

type Phase = "playing" | "result" | "question-result" | "final-result";

type RoundResult = MatchEvaluation & {
  submitted: RGB;
  target: RGB;
};

const GRADE_STYLE: Record<
  MatchGrade,
  { bg: string; text: string; ring: string }
> = {
  S: { bg: "bg-amber-400", text: "text-amber-950", ring: "ring-amber-300" },
  A: { bg: "bg-emerald-400", text: "text-emerald-950", ring: "ring-emerald-300" },
  B: { bg: "bg-sky-400", text: "text-sky-950", ring: "ring-sky-300" },
  C: { bg: "bg-orange-300", text: "text-orange-950", ring: "ring-orange-200" },
  D: { bg: "bg-stone-300", text: "text-stone-800", ring: "ring-stone-200" },
};

function BackToHomeButton({
  className = "",
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center justify-center rounded-xl border-2 border-amber-400/70 bg-white/90 px-4 py-2.5 text-sm font-semibold text-amber-800 shadow-sm transition hover:border-amber-500 hover:bg-amber-50 ${fullWidth ? "w-full" : ""} ${className}`}
    >
      ← 메인으로
    </Link>
  );
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fallback below */
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function ShareNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className="text-center text-sm font-medium text-amber-700"
    >
      {message}
    </p>
  );
}

function PlayHeader({
  mode,
  modeConfig,
  questionIndex,
}: {
  mode: GameModeId;
  modeConfig: (typeof GAME_MODES)[GameModeId];
  questionIndex: number;
}) {
  const isMarathon = modeConfig.totalQuestions > 1;
  const title = mode === "single" ? "컬러 매처" : modeConfig.title;

  return (
    <header className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <BackToHomeButton className="shrink-0" />
        <h1 className="min-w-0 flex-1 text-center text-xl font-bold text-amber-900 sm:text-2xl">
          {title}
        </h1>
        <div className="w-[88px] shrink-0 sm:w-[96px]" aria-hidden />
      </div>
      {isMarathon && (
        <p className="text-center text-sm font-semibold text-amber-600">
          {questionIndex} / {modeConfig.totalQuestions}
        </p>
      )}
      <p className="text-center text-xs text-amber-700 sm:text-sm">
        물감을 섞어 타겟 색상과 가장 비슷한 색을 만들어보세요
      </p>
    </header>
  );
}

type ColorMatcherGameProps = {
  mode: GameModeId;
};

export default function ColorMatcherGame({ mode }: ColorMatcherGameProps) {
  const modeConfig = GAME_MODES[mode];
  const isMarathon = modeConfig.totalQuestions > 1;

  const [phase, setPhase] = useState<Phase>("playing");
  const [target, setTarget] = useState<RGB | null>(null);
  const [tool, setTool] = useState<BrushTool>("paint-r");
  const [brushSize, setBrushSize] = useState<BrushSizeKey>("medium");
  const [pickedColor, setPickedColor] = useState<RGB | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paletteSnapshot, setPaletteSnapshot] = useState("");
  const targetLockedRef = useRef<RGB | null>(null);
  const [ready, setReady] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [roundScores, setRoundScores] = useState<number[]>([]);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const loadNewTarget = useCallback(() => {
    const next = generateTarget();
    targetLockedRef.current = cloneRGB(next);
    setTarget(next);
  }, []);

  const resetPalette = useCallback(() => {
    setPickedColor(null);
    setResetKey((k) => k + 1);
  }, []);

  const resetRoundUI = useCallback(() => {
    setResult(null);
    setPaletteSnapshot("");
    setPickedColor(null);
    setResetKey((k) => k + 1);
    setPhase("playing");
  }, []);

  useEffect(() => {
    loadNewTarget();
    setReady(true);
  }, [loadNewTarget]);

  useEffect(() => {
    if (!shareMessage) return;
    const timer = window.setTimeout(() => setShareMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  const handleColorPick = useCallback((color: RGB) => {
    setPickedColor(color);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!pickedColor || !target) return;

    const frozenTarget = cloneRGB(targetLockedRef.current ?? target);
    const evaluation = evaluateMatch(pickedColor, frozenTarget);

    const roundResult: RoundResult = {
      ...evaluation,
      submitted: cloneRGB(pickedColor),
      target: frozenTarget,
    };

    setResult(roundResult);

    if (canvasRef.current) {
      setPaletteSnapshot(canvasRef.current.toDataURL("image/png"));
    }

    if (isMarathon) {
      const updatedScores = [...roundScores, evaluation.percent];
      setRoundScores(updatedScores);

      if (questionIndex >= modeConfig.totalQuestions) {
        setPhase("final-result");
      } else {
        setPhase("question-result");
      }
    } else {
      setPhase("result");
    }
  }, [
    pickedColor,
    target,
    isMarathon,
    roundScores,
    questionIndex,
    modeConfig.totalQuestions,
  ]);

  const handleRetrySame = useCallback(() => {
    resetRoundUI();
  }, [resetRoundUI]);

  const handleNewQuestion = useCallback(() => {
    loadNewTarget();
    resetRoundUI();
  }, [loadNewTarget, resetRoundUI]);

  const handleNextQuestion = useCallback(() => {
    setQuestionIndex((q) => q + 1);
    loadNewTarget();
    resetRoundUI();
  }, [loadNewTarget, resetRoundUI]);

  const handleRestartMarathon = useCallback(() => {
    setQuestionIndex(1);
    setRoundScores([]);
    loadNewTarget();
    setResult(null);
    setPaletteSnapshot("");
    setPickedColor(null);
    setResetKey((k) => k + 1);
    setPhase("playing");
  }, [loadNewTarget]);

  const buildShareText = useCallback((): string | null => {
    if (phase === "final-result" && isMarathon && roundScores.length > 0) {
      return `🎨 컬러 매처 ${modeConfig.title}\n평균 ${averageScore(roundScores).toFixed(1)}점 / 100`;
    }

    if (!result) return null;

    if (isMarathon) {
      const scores = roundScores.length > 0 ? roundScores : [result.percent];
      return `🎨 컬러 매처 ${modeConfig.title}\n평균 ${averageScore(scores).toFixed(1)}점 / 100`;
    }

    const deltaE = result.deltaE ?? 0;
    return `🎨 컬러 매처\n${result.grade}등급 · ${result.percent.toFixed(1)}% 일치! (ΔE ${deltaE.toFixed(1)})`;
  }, [phase, isMarathon, roundScores, result, modeConfig.title]);

  const handleShare = useCallback(async () => {
    const text = buildShareText();
    if (!text) {
      setShareMessage("공유할 결과가 없습니다.");
      return;
    }

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "컬러 매처", text });
        setShareMessage("공유했습니다!");
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
      }
    }

    const copied = await copyTextToClipboard(text);
    setShareMessage(
      copied
        ? "결과가 클립보드에 복사되었습니다!"
        : "복사에 실패했습니다. 다시 시도해 주세요.",
    );
  }, [buildShareText]);

  if (!ready || !target) {
    return (
      <div className="flex flex-1 items-center justify-center py-20 text-amber-700">
        준비 중...
      </div>
    );
  }

  if (phase === "final-result" && isMarathon) {
    const finalScore = averageScore(roundScores);
    const finalGrade = getMatchGradeFromPercent(finalScore);
    const gradeStyle = GRADE_STYLE[finalGrade];

    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 px-2 py-5 sm:max-w-lg sm:gap-5 sm:px-4 sm:py-6">
        <AdSlot slotId="final-top" variant="top" />
        <h2 className="text-2xl font-bold text-amber-900">챌린지 완료!</h2>
        <p className="text-sm text-amber-700">{modeConfig.title}</p>

        <div className="flex flex-col items-center rounded-2xl border-4 border-amber-600/30 bg-white/90 px-8 py-6 shadow-lg">
          <span
            className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-black ring-4 ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.ring}`}
          >
            {finalGrade}
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            최종 평균 점수
          </p>
          <p className="text-6xl font-black text-amber-900">
            {finalScore.toFixed(1)}
          </p>
          <p className="text-sm text-amber-600">/ 100</p>
        </div>

        <div className="grid w-full grid-cols-5 gap-1.5 sm:grid-cols-10">
          {roundScores.map((score, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-lg bg-amber-100/80 px-1 py-2"
            >
              <span className="text-[10px] text-amber-600">{i + 1}</span>
              <span className="font-mono text-xs font-bold text-amber-900">
                {score.toFixed(0)}
              </span>
            </div>
          ))}
        </div>

        <AdSlot slotId="final-inline" variant="inline" />

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 rounded-xl bg-amber-600 py-3 font-semibold text-white shadow-md transition hover:bg-amber-700"
          >
            공유하기
          </button>
          <button
            type="button"
            onClick={handleRestartMarathon}
            className="flex-1 rounded-xl border-2 border-amber-600 py-3 font-semibold text-amber-800 transition hover:bg-amber-50"
          >
            다시 도전
          </button>
        </div>
        <ShareNotice message={shareMessage} />
        <BackToHomeButton fullWidth />
        <AdSlot slotId="final-bottom" variant="bottom" />
      </div>
    );
  }

  if (phase === "question-result" && result && isMarathon) {
    const grade =
      result.grade ?? getMatchGrade(result.percent, result.deltaE ?? 100);
    const gradeStyle = GRADE_STYLE[grade];

    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 px-2 py-5 sm:max-w-lg sm:gap-5 sm:px-4 sm:py-6">
        <BackToHomeButton className="self-start" />
        <p className="text-sm font-semibold text-amber-600">
          {questionIndex} / {modeConfig.totalQuestions} 문제 완료
        </p>
        <h2 className="text-xl font-bold text-amber-900">이번 문제 결과</h2>

        <div className="flex flex-col items-center rounded-2xl border-2 border-amber-300/60 bg-white/90 px-6 py-5 shadow-sm">
          <span
            className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ring-2 ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.ring}`}
          >
            {grade}
          </span>
          <span className="text-4xl font-black text-amber-900">
            {result.percent.toFixed(1)}%
          </span>
          <span className="mt-1 text-sm text-amber-700">{result.label}</span>
        </div>

        <div className="flex items-center gap-4">
          <ColorSwatch color={result.submitted} label="내 색" />
          <span className="text-amber-500">vs</span>
          <ColorSwatch color={result.target} label="타겟" />
        </div>

        <button
          type="button"
          onClick={handleNextQuestion}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-lg font-bold text-white shadow-lg transition hover:from-amber-600 hover:to-orange-600"
        >
          다음 문제 →
        </button>
      </div>
    );
  }

  if (phase === "result" && result && !isMarathon) {
    const grade =
      result.grade ?? getMatchGrade(result.percent, result.deltaE ?? 100);
    const gradeStyle = GRADE_STYLE[grade];

    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 px-2 py-5 sm:max-w-lg sm:gap-5 sm:px-4 sm:py-6">
        <BackToHomeButton className="self-start" />
        <AdSlot slotId="result-top" variant="top" />
        <h2 className="text-2xl font-bold text-amber-900">결과</h2>

        <div className="relative w-full overflow-hidden rounded-2xl border-4 border-amber-700/40 shadow-xl">
          {paletteSnapshot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={paletteSnapshot}
              alt="내 팔레트"
              className="h-48 w-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span
              className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full text-xl font-black ring-4 ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.ring}`}
            >
              {grade}
            </span>
            <span className="text-6xl font-black text-white drop-shadow-lg">
              {result.percent.toFixed(1)}%
            </span>
            <span className="mt-1 text-lg font-semibold text-amber-200">
              {result.label}
            </span>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-6">
          <ColorSwatch color={result.submitted} label="내가 고른 색" />
          <span className="text-2xl text-amber-600">vs</span>
          <ColorSwatch color={result.target} label="타겟 색상" />
        </div>

        {result.breakdown && (
          <MatchBreakdownPanel breakdown={result.breakdown} />
        )}

        <AdSlot slotId="result-inline" variant="inline" />

        <div className="flex w-full flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRetrySame}
              className="flex-1 rounded-xl border-2 border-amber-600 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
            >
              같은 색 다시 도전
            </button>
            <button
              type="button"
              onClick={handleNewQuestion}
              className="flex-1 rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700"
            >
              새 문제
            </button>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="w-full rounded-xl border border-amber-400 py-2.5 text-sm font-medium text-amber-800 transition hover:bg-amber-50"
          >
            공유하기
          </button>
          <ShareNotice message={shareMessage} />
          <BackToHomeButton fullWidth />
        </div>

        <AdSlot slotId="result-bottom" variant="bottom" />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 px-2 py-5 sm:max-w-lg sm:gap-5 sm:px-4 sm:py-6">
      <PlayHeader
        mode={mode}
        modeConfig={modeConfig}
        questionIndex={questionIndex}
      />

      <AdSlot slotId="play-top" variant="top" />

      <div className="flex w-full flex-col items-center">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-amber-600">
          타겟 색상
        </p>
        <ColorSwatch color={target} size="lg" />
      </div>

      <div className="flex w-full flex-col items-center gap-2">
        <PaletteCanvas
          tool={tool}
          brushSize={brushSize}
          onColorPick={handleColorPick}
          canvasRef={canvasRef}
          resetKey={resetKey}
        />
        <button
          type="button"
          onClick={resetPalette}
          className="flex items-center gap-1.5 rounded-lg border border-amber-400/60 bg-white/90 px-4 py-1.5 text-sm font-medium text-amber-800 shadow-sm transition hover:bg-amber-50 hover:border-amber-500"
        >
          <span aria-hidden>🧽</span>
          팔레트 초기화
        </button>
      </div>

      <AdSlot slotId="play-mid" variant="inline" />

      <div className="flex w-full flex-wrap justify-center gap-2">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTool(t.id)}
            className={`flex h-12 min-w-[3.5rem] flex-col items-center justify-center rounded-xl border-2 px-3 text-sm font-bold transition ${
              tool === t.id
                ? "border-amber-600 bg-amber-100 shadow-md scale-105"
                : "border-amber-300/60 bg-white hover:bg-amber-50"
            }`}
            style={
              t.color && tool !== t.id
                ? { borderColor: t.color + "66" }
                : t.color && tool === t.id
                  ? { borderColor: t.color, backgroundColor: t.color + "22" }
                  : undefined
            }
          >
            <span>{t.icon}</span>
            <span className="text-xs">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex w-full items-center justify-center gap-3">
        <span className="text-xs font-semibold text-amber-700">붓 크기</span>
        <div className="flex items-end gap-3 rounded-xl border border-amber-300/50 bg-white/80 px-4 py-2">
          {(Object.keys(BRUSH_SIZES) as BrushSizeKey[]).map((key) => {
            const { dot } = BRUSH_SIZES[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setBrushSize(key)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                  brushSize === key
                    ? "bg-amber-100 ring-2 ring-amber-500"
                    : "hover:bg-amber-50"
                }`}
              >
                <span
                  className="rounded-full bg-amber-800"
                  style={{ width: dot, height: dot }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-amber-600/80">
        {tool === "blend"
          ? "섞기 붓으로 물감을 끌어당기며 경계를 문질러 보세요"
          : tool === "picker"
            ? "팔레트에서 원하는 색 지점을 클릭하세요"
            : "물감을 드래그하여 팔레트에 덜어놓으세요"}
      </p>

      <div className="flex w-full items-center gap-4 rounded-2xl border-2 border-amber-300/50 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-semibold text-amber-700">선택한 색</p>
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-inner transition ${
              pickedColor ? "border-amber-400" : "border-dashed border-amber-300"
            }`}
            style={{
              backgroundColor: pickedColor
                ? rgbToCss(pickedColor)
                : "transparent",
            }}
          >
            {!pickedColor && <span className="text-2xl opacity-40">?</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!pickedColor}
          className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-lg font-bold text-white shadow-lg transition enabled:hover:from-amber-600 enabled:hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          제출하기
        </button>
      </div>

      <AdSlot slotId="play-bottom" variant="bottom" />
    </div>
  );
}
