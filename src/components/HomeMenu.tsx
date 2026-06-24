import AdSlot from "@/components/AdSlot";
import Link from "next/link";

export default function HomeMenu() {
  return (
    <div className="flex min-h-full w-full flex-1 flex-col items-center bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 px-4 py-8 sm:py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-6 sm:max-w-lg">
        <header className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md ring-2 ring-amber-300/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-full w-full"
              aria-hidden
            >
              <ellipse cx="256" cy="268" rx="148" ry="132" fill="#FFF7ED" />
              <circle cx="198" cy="210" r="54" fill="#DC2626" />
              <circle cx="314" cy="210" r="54" fill="#16A34A" />
              <circle cx="256" cy="318" r="54" fill="#2563EB" />
              <circle cx="332" cy="300" r="30" fill="#FAFAF9" />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-amber-900 sm:text-4xl">
            컬러 매처
          </h1>
          <p className="mt-2 text-sm text-amber-700 sm:text-base">
            물감을 섞어 타겟 색상과 가장 비슷한 색을 만들어보세요
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

        <AdSlot slotId="home-bottom" variant="bottom" />

        <footer className="pt-2 text-center">
          <Link
            href="/privacy"
            className="text-xs text-amber-600/80 underline-offset-2 hover:text-amber-800 hover:underline"
          >
            개인정보 처리방침
          </Link>
        </footer>
      </div>
    </div>
  );
}
