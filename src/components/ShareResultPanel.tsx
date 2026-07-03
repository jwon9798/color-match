"use client";

import {
  buildShareText,
  downloadShareCard,
  renderShareCard,
  shareResultCard,
  type ShareCardData,
} from "@/lib/shareCard";
import { useCallback, useEffect, useState } from "react";

type ShareResultPanelProps = {
  data: ShareCardData;
  compact?: boolean;
};

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fallback */
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

export default function ShareResultPanel({ data, compact = false }: ShareResultPanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    renderShareCard(data)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setPreviewUrl(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [data]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  const run = useCallback(
    async (action: "share" | "download" | "copy") => {
      setBusy(true);
      try {
        if (action === "share") {
          const result = await shareResultCard(data);
          if (result === "shared") setMessage("공유했습니다!");
          else if (result === "copied")
            setMessage("이미지 저장 + 결과 텍스트가 복사되었습니다!");
          else setMessage("이미지가 저장되었습니다!");
        } else if (action === "download") {
          await downloadShareCard(data);
          setMessage("이미지를 저장했습니다!");
        } else {
          const ok = await copyText(buildShareText(data));
          setMessage(ok ? "결과 텍스트가 복사되었습니다!" : "복사에 실패했습니다.");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setMessage("잠시 후 다시 시도해 주세요.");
      } finally {
        setBusy(false);
      }
    },
    [data],
  );

  return (
    <div className={`share-panel w-full ${compact ? "" : "space-y-4"}`}>
      {!compact && (
        <div className="share-panel__preview overflow-hidden rounded-2xl border border-amber-200/60 bg-slate-950/5 shadow-inner">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="공유용 결과 카드 미리보기"
              className="mx-auto w-full max-w-[280px] animate-fade-in"
            />
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-amber-700/70">
              카드 생성 중...
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={busy}
          onClick={() => run("share")}
          className="share-panel__btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60"
        >
          <span aria-hidden>📤</span>
          결과 카드 공유
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => run("download")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-indigo-300/70 bg-white/90 py-3.5 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50 disabled:opacity-60"
        >
          <span aria-hidden>💾</span>
          이미지 저장
        </button>
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => run("copy")}
        className="w-full rounded-xl border border-amber-300/60 py-2.5 text-sm font-medium text-amber-800 transition hover:bg-amber-50 disabled:opacity-60"
      >
        텍스트만 복사
      </button>

      {message && (
        <p role="status" aria-live="polite" className="text-center text-sm font-medium text-emerald-700">
          {message}
        </p>
      )}
    </div>
  );
}
