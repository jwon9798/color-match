import LegalPageLayout from "@/components/LegalPageLayout";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description:
    "컬러 매처 개인정보 처리방침. Google AdSense 광고, 쿠키 사용, 이용자 권리에 관한 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="개인정보 처리방침" updated="2026년 6월 24일">
      <p>
        {SITE_NAME}({SITE_URL}, 이하 &quot;서비스&quot;)는 이용자의
        개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을
        준수합니다. 본 방침은 서비스 이용 시 적용됩니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">1. 수집하는 개인정보</h2>
      <p>
        서비스는 회원가입 없이 이용할 수 있습니다. 게임 플레이 기록(점수,
        선택 색상 등)은 <strong>브라우저 세션 내에서만</strong> 처리되며,
        서비스 운영자가 별도의 서버에 저장하지 않습니다.
      </p>
      <p>
        다만, 웹 서비스 제공 과정에서 아래 정보가 자동으로 생성·수집될 수
        있습니다.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>IP 주소, 브라우저 종류, 운영체제, 접속 일시</li>
        <li>접속 로그, 기기 정보, referrer URL</li>
        <li>쿠키 및 유사 기술을 통해 수집되는 정보(아래 광고 항목 참조)</li>
      </ul>

      <h2 className="pt-2 text-base font-semibold">2. Google AdSense 및 광고 쿠키</h2>
      <p>
        본 서비스는 Google LLC가 제공하는{" "}
        <strong>Google AdSense</strong>를 통해 광고를 게재할 수 있습니다.
        Google을 포함한 제3자 광고 공급업체는 이용자의 이전 방문 기록을
        바탕으로 맞춤 광고를 게재하기 위해 쿠키를 사용할 수 있습니다.
      </p>
      <p>
        Google의 광고 쿠키 사용으로 Google 및 파트너는 본 서비스 및/또는
        다른 웹사이트 방문 기록을 바탕으로 광고를 게재할 수 있습니다.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Google 광고 정책:{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://policies.google.com/technologies/ads
          </a>
        </li>
        <li>
          Google 개인정보처리방침:{" "}
          <a
            href="https://policies.google.com/privacy"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://policies.google.com/privacy
          </a>
        </li>
        <li>
          Google 맞춤 광고 설정(옵트아웃):{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.google.com/settings/ads
          </a>
        </li>
        <li>
          www.aboutads.info (미국):{" "}
          <a
            href="https://www.aboutads.info/choices/"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.aboutads.info/choices/
          </a>
        </li>
        <li>
          www.youronlinechoices.eu (EU):{" "}
          <a
            href="https://www.youronlinechoices.eu/"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youronlinechoices.eu/
          </a>
        </li>
      </ul>
      <p>
        이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 쿠키
        저장을 거부할 경우 일부 서비스 이용 또는 광고 표시에 제한이 있을
        수 있습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">3. 개인정보의 이용 목적</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>웹 게임 서비스 제공 및 운영</li>
        <li>서비스 품질 개선, 오류 분석</li>
        <li>광고 게재(Google AdSense 등)</li>
        <li>법령 준수 및 분쟁 대응</li>
      </ul>

      <h2 className="pt-2 text-base font-semibold">4. 보관 기간</h2>
      <p>
        서버에 별도 저장하지 않는 게임 데이터는 세션 종료 시 소멸합니다.
        접속 로그 등은 호스팅 서비스(Vercel 등) 정책에 따라 일정 기간
        보관될 수 있습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">5. 아동의 개인정보</h2>
      <p>
        서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 의도적으로
        아동의 개인정보를 수집하지 않습니다. 보호자가 아동의 정보 제공
        사실을 알게 된 경우 아래 연락처로 문의해 주시면 조치하겠습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">6. 이용자의 권리</h2>
      <p>
        이용자는 개인정보 열람·정정·삭제·처리 정지 등을 요청할 수
        있습니다. 쿠키 관련 설정은 브라우저 또는 위 Google/제3자 옵트아웃
        페이지에서 변경할 수 있습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">7. 개인정보 보호책임자 및 문의</h2>
      <p>
        개인정보 관련 문의·불만·피해 구제는 아래로 연락해 주세요.
      </p>
      <ul className="list-none space-y-1 pl-0">
        <li>
          <strong>서비스명:</strong> {SITE_NAME}
        </li>
        <li>
          <strong>문의 페이지:</strong>{" "}
          <Link href="/contact" className="underline underline-offset-2">
            {SITE_URL}/contact
          </Link>
        </li>
        {CONTACT_EMAIL ? (
          <li>
            <strong>이메일:</strong>{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
          </li>
        ) : null}
      </ul>

      <h2 className="pt-2 text-base font-semibold">8. 방침 변경</h2>
      <p>
        본 방침은 법령·서비스 변경에 따라 수정될 수 있으며, 변경 시 본
        페이지에 게시합니다. 중요한 변경이 있는 경우 서비스 내 공지할 수
        있습니다.
      </p>

      <p className="pt-2 text-xs text-amber-700/80">
        관련:{" "}
        <Link href="/terms" className="underline underline-offset-2">
          이용약관
        </Link>
      </p>
    </LegalPageLayout>
  );
}
