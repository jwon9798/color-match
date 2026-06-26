import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  title,
  updated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <article className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 text-amber-950">
        <header>
          <Link
            href="/"
            className="text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            ← 메인으로
          </Link>
          <h1 className="mt-4 text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-amber-800/80">최종 업데이트: {updated}</p>
        </header>
        <section className="space-y-4 text-sm leading-relaxed text-amber-900/90">
          {children}
        </section>
      </article>
    </div>
  );
}
