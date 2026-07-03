import AdSlot from "@/components/AdSlot";
import BrandIcon from "@/components/BrandIcon";
import {
  OPERATOR_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/siteConfig";
import Link from "next/link";

export default function HomeMenu() {
  return (
    <div className="flex min-h-full w-full flex-1 flex-col items-center bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 px-4 py-8 sm:py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-6 sm:max-w-lg">
        <header className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-md ring-2 ring-amber-300/60">
            <BrandIcon />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-amber-900 sm:text-4xl">
            {SITE_NAME}
          </h1>
          <p className="mt-2 text-sm text-amber-700 sm:text-base">
            {SITE_DESCRIPTION}
          </p>
          <p className="mt-1 text-xs text-amber-600/90">
            by{" "}
            <a
              href="https://jwonlabs.com"
              className="font-medium underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {OPERATOR_NAME}
            </a>
          </p>
        </header>

        <AdSlot slotId="home-top" variant="top" />

        <Link
          href="/play/single"
          className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-5 text-center text-xl font-bold text-white shadow-lg transition hover:from-amber-600 hover:to-orange-600 hover:shadow-xl"
        >
          시작하기
        </Link>

        <div className="flex w-full gap-3">
          <Link
            href="/play/marathon-10"
            className="flex-1 rounded-xl border-2 border-amber-400/70 bg-white/90 py-4 text-center text-lg font-bold text-amber-900 shadow-sm transition hover:border-amber-500 hover:bg-amber-50"
          >
            10문제
          </Link>
          <Link
            href="/play/marathon-20"
            className="flex-1 rounded-xl border-2 border-amber-400/70 bg-white/90 py-4 text-center text-lg font-bold text-amber-900 shadow-sm transition hover:border-amber-500 hover:bg-amber-50"
          >
            20문제
          </Link>
        </div>

        <section className="w-full space-y-3 rounded-2xl border border-amber-200/80 bg-white/85 p-5 text-left shadow-sm">
          <h2 className="text-base font-bold text-amber-900">이렇게 플레이해요</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-amber-900/90">
            <li>타겟 색상을 확인합니다.</li>
            <li>R·G·B·W 물감을 팔레트에 섞습니다.</li>
            <li>스포이드로 색을 고르고 제출해 점수를 확인합니다.</li>
          </ol>
          <Link
            href="/guide"
            className="inline-block text-sm font-medium text-amber-700 underline-offset-2 hover:text-amber-900 hover:underline"
          >
            자세한 가이드 · FAQ 보기 →
          </Link>
        </section>

        <section className="w-full space-y-2 rounded-2xl border border-amber-200/60 bg-amber-50/80 p-5 text-left">
          <h2 className="text-sm font-bold text-amber-900">왜 {SITE_NAME}인가요?</h2>
          <ul className="space-y-1.5 text-sm text-amber-900/85">
            <li>✓ 설치 없이 브라우저에서 무료 플레이</li>
            <li>✓ 미술·디자인 색감을 가볍게 훈련</li>
            <li>✓ 10·20문제 챌린지로 친구와 점수 겨루기</li>
          </ul>
        </section>

        <AdSlot slotId="home-bottom" variant="bottom" />
      </div>
    </div>
  );
}
