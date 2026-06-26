import LegalPageLayout from "@/components/LegalPageLayout";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "문의",
  description: "컬러 매처 서비스 문의, 버그 신고, 광고·제휴 관련 연락처입니다.",
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="문의하기" updated="2026년 6월 24일">
      <p>
        {SITE_NAME} 이용 중 불편한 점, 버그, 기능 제안, 광고·제휴 문의 등은
        아래 방법으로 연락해 주세요. 영업일 기준 가능한 한 빠르게
        답변드리겠습니다.
      </p>

      {CONTACT_EMAIL ? (
        <div className="rounded-xl border border-amber-200 bg-white/80 p-5">
          <h2 className="text-base font-semibold">이메일 문의</h2>
          <p className="mt-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-lg font-medium text-amber-900 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-3 text-xs text-amber-700/80">
            메일 제목에 [컬러매처]를 붙여 주시면 확인이 빠릅니다.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-300 bg-amber-100/60 p-5">
          <h2 className="text-base font-semibold">운영자 연락처</h2>
          <p className="mt-2">
            서비스 운영자 이메일은 사이트 설정을 통해 등록됩니다. AdSense
            심사 및 이용자 문의를 위해 운영자가 확인 가능한 이메일 주소를
            제공하고 있습니다.
          </p>
        </div>
      )}

      <h2 className="pt-2 text-base font-semibold">문의 유형</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>게임 오류·표시 문제</li>
        <li>개인정보·쿠키·광고 관련 문의</li>
        <li>저작권·콘텐츠 관련 문의</li>
        <li>기타 서비스 이용 문의</li>
      </ul>

      <h2 className="pt-2 text-base font-semibold">서비스 URL</h2>
      <p>
        <a
          href={SITE_URL}
          className="font-medium underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {SITE_URL}
        </a>
      </p>

      <p className="pt-2 text-xs text-amber-700/80">
        개인정보 처리에 관한 내용은{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          개인정보 처리방침
        </Link>
        을 참고해 주세요.
      </p>
    </LegalPageLayout>
  );
}
