import Link from "next/link";

export const metadata = {
  title: "개인정보 처리방침 | 컬러 매처",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 text-amber-950">
      <header>
        <Link
          href="/"
          className="text-sm font-medium text-amber-700 hover:text-amber-900"
        >
          ← 메인으로
        </Link>
        <h1 className="mt-4 text-2xl font-bold">개인정보 처리방침</h1>
        <p className="mt-2 text-sm text-amber-800/80">
          최종 업데이트: 2026년 6월 24일
        </p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed text-amber-900/90">
        <p>
          컬러 매처(이하 &quot;서비스&quot;)는 이용자의 개인정보를 소중히
          다룹니다. 본 방침은 서비스 이용 시 적용됩니다.
        </p>

        <h2 className="pt-2 text-base font-semibold">1. 수집하는 정보</h2>
        <p>
          서비스는 회원가입 없이 이용할 수 있으며, 게임 플레이 기록은
          브라우저 세션 내에서만 사용됩니다. 서버에 별도로 저장하지 않습니다.
        </p>

        <h2 className="pt-2 text-base font-semibold">2. 광고 및 쿠키</h2>
        <p>
          본 서비스는 Google AdSense를 통해 광고를 게재할 수 있습니다. Google
          및 제3자 공급업체는 쿠키를 사용하여 이용자의 관심사에 기반한 광고를
          표시할 수 있습니다. Google의 광고 쿠키 사용에 대한 자세한 내용은{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 정책
          </a>
          을 참고해 주세요.
        </p>
        <p>
          맞춤 광고를 원하지 않으시면{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 설정
          </a>
          에서 비활성화할 수 있습니다.
        </p>

        <h2 className="pt-2 text-base font-semibold">3. 문의</h2>
        <p>
          개인정보 관련 문의는 서비스 운영자에게 연락해 주세요.
        </p>
      </section>
    </div>
  );
}
