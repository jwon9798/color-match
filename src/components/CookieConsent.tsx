"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/siteConfig";
import { useEffect, useState } from "react";
import {
  applyConsent,
  getStoredConsent,
  setStoredConsent,
  type ConsentStatus,
} from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  const saveConsent = (status: ConsentStatus) => {
    setStoredConsent(status);
    applyConsent(status);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="쿠키 및 개인정보 수집 안내"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-amber-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-sm sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <p className="text-xs leading-relaxed text-amber-900/90 sm:text-sm">
          {SITE_NAME}는 <strong>무료 서비스</strong>입니다. 방문 통계 분석을
          위해 <strong>Google Analytics 4</strong>가 쿠키를 사용할 수 있습니다.
          동의하시면 분석 목적의 쿠키가 활성화됩니다. 자세한 내용은{" "}
          <Link
            href="/privacy"
            className="font-medium text-amber-800 underline underline-offset-2"
          >
            개인정보 처리방침
          </Link>
          을 참고해 주세요.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => saveConsent("denied")}
            className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
          >
            거부
          </button>
          <button
            type="button"
            onClick={() => saveConsent("granted")}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  );
}
