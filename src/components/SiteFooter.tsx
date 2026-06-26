import { CONTACT_EMAIL, LEGAL_PAGES, SITE_NAME } from "@/lib/siteConfig";
import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-amber-200/80 bg-amber-50/90 px-4 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <nav
          aria-label="사이트 정보"
          className="flex flex-wrap justify-center gap-x-4 gap-y-2"
        >
          {LEGAL_PAGES.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-amber-800/90 underline-offset-2 hover:text-amber-950 hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 text-center text-xs leading-relaxed text-amber-700/90">
          <p>
            {SITE_NAME} — 무료 웹 색감 매칭 게임 · 설치 없이 브라우저에서 플레이
          </p>
          {CONTACT_EMAIL ? (
            <p>
              문의:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-amber-900 underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          ) : (
            <p>
              문의:{" "}
              <Link
                href="/contact"
                className="font-medium text-amber-900 underline-offset-2 hover:underline"
              >
                문의하기 페이지
              </Link>
            </p>
          )}
          <p className="text-amber-600/80">
            © {year} {SITE_NAME}. All rights reserved.
          </p>
        </div>

        <p className="text-center text-[10px] leading-relaxed text-amber-600/70">
          본 사이트는 Google AdSense를 통해 광고를 게재할 수 있습니다.{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            개인정보 처리방침
          </Link>
          을 확인해 주세요.
        </p>
      </div>
    </footer>
  );
}
