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
    <div className="home-glow flex min-h-full w-full flex-1 flex-col items-center px-4 py-8 sm:py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-6 sm:max-w-lg">
        <header className="animate-fade-in text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-lg ring-2 ring-amber-300/60">
            <BrandIcon />
          </div>
          <h1 className="bg-gradient-to-br from-amber-900 via-orange-800 to-amber-700 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-amber-800/90 sm:text-base">
            {SITE_DESCRIPTION}
          </p>
          <p className="mt-2 text-xs text-amber-600/90">
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
          className="animate-fade-in w-full rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500 py-5 text-center text-xl font-bold text-white shadow-xl transition hover:shadow-2xl hover:brightness-105"
          style={{ animationDelay: "0.08s" }}
        >
          시작하기
        </Link>

        <div className="animate-fade-in flex w-full gap-3" style={{ animationDelay: "0.12s" }}>
          <Link
            href="/play/marathon-10"
            className="flex-1 rounded-xl border-2 border-white/80 bg-white/90 py-4 text-center text-lg font-bold text-amber-900 shadow-md backdrop-blur transition hover:border-amber-400 hover:bg-white"
          >
            🔥 10문제
          </Link>
          <Link
            href="/play/marathon-20"
            className="flex-1 rounded-xl border-2 border-white/80 bg-white/90 py-4 text-center text-lg font-bold text-amber-900 shadow-md backdrop-blur transition hover:border-amber-400 hover:bg-white"
          >
            👑 20문제
          </Link>
        </div>

        <section
          className="animate-fade-in w-full space-y-3 rounded-2xl border border-white/70 bg-white/85 p-5 text-left shadow-md backdrop-blur-sm"
          style={{ animationDelay: "0.16s" }}
        >
          <h2 className="text-base font-bold text-amber-900">이렇게 플레이해요</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-amber-900/90">
            <li>타겟 색상을 확인합니다.</li>
            <li>R·G·B·W 물감을 팔레트에 섞습니다.</li>
            <li>스포이드로 색을 고르고 제출해 점수를 확인합니다.</li>
          </ol>
          <Link
            href="/guide"
            className="inline-block text-sm font-medium text-indigo-700 underline-offset-2 hover:text-indigo-900 hover:underline"
          >
            자세한 가이드 · FAQ 보기 →
          </Link>
        </section>

        <section
          className="animate-fade-in w-full space-y-2 rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/90 to-orange-50/80 p-5 text-left shadow-sm"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-sm font-bold text-amber-900">결과를 공유하고 친구와 겨루세요</h2>
          <ul className="space-y-1.5 text-sm text-amber-900/85">
            <li>✓ 결과 카드 이미지로 SNS·카톡 공유</li>
            <li>✓ 상위 몇 %인지 한눈에 확인</li>
            <li>✓ 10·20문제 챌린지로 점수 겨루기</li>
          </ul>
        </section>

        <AdSlot slotId="home-bottom" variant="bottom" />
      </div>
    </div>
  );
}
