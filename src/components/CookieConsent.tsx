"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "color-match-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "accepted") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="쿠키 안내"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-amber-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-sm sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-amber-900/90 sm:text-sm">
          본 사이트는 서비스 제공 및 Google AdSense 광고 게재를 위해 쿠키를
          사용할 수 있습니다. 자세한 내용은{" "}
          <Link
            href="/privacy"
            className="font-medium text-amber-800 underline underline-offset-2"
          >
            개인정보 처리방침
          </Link>
          을 참고해 주세요.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          확인
        </button>
      </div>
    </div>
  );
}
