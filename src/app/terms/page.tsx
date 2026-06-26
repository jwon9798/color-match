import LegalPageLayout from "@/components/LegalPageLayout";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  description: "컬러 매처 웹 게임 서비스 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="이용약관" updated="2026년 6월 24일">
      <p>
        본 약관은 {SITE_NAME}({SITE_URL}, 이하 &quot;서비스&quot;) 이용과
        관련하여 서비스와 이용자 간의 권리·의무 및 책임 사항을 규정합니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">제1조 (목적)</h2>
      <p>
        본 약관은 서비스 이용 조건 및 절차, 서비스와 이용자의 권리·의무 등
        기본적인 사항을 정함을 목적으로 합니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">제2조 (서비스 내용)</h2>
      <p>
        서비스는 웹 브라우저에서 제공하는 무료 색감 매칭 게임입니다. 서비스
        내용·기능·디자인은 운영상 필요에 따라 변경될 수 있습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">제3조 (이용자의 의무)</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>타인의 권리를 침해하거나 불법적인 목적으로 서비스를 이용하지 않습니다.</li>
        <li>
          서비스의 정상적인 운영을 방해하는 행위(과도한 자동 요청, 악성
          트래픽 유발 등)를 하지 않습니다.
        </li>
        <li>관련 법령 및 본 약관을 준수합니다.</li>
      </ul>

      <h2 className="pt-2 text-base font-semibold">제4조 (지적재산권)</h2>
      <p>
        서비스에 포함된 소프트웨어, 디자인, 텍스트, 로고 등 모든 콘텐츠에
        대한 권리는 서비스 운영자 또는 정당한 권리자에게 귀속됩니다.
        이용자는 운영자의 사전 동의 없이 이를 복제·배포·상업적으로 이용할
        수 없습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">제5조 (광고)</h2>
      <p>
        서비스는 Google AdSense 등 제3자 광고 네트워크를 통해 광고를
        게재할 수 있습니다. 광고 클릭 및 제3자 사이트 이용은 해당
        광고주·제3자의 정책에 따릅니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">제6조 (면책)</h2>
      <p>
        서비스는 &quot;있는 그대로&quot; 제공됩니다. 천재지변, 네트워크 장애,
        제3자 서비스 오류 등으로 인한 손해에 대해 법령이 허용하는 범위
        내에서 책임을 제한할 수 있습니다. 게임 점수·등급은 참고용이며
        특정 결과를 보장하지 않습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">제7조 (약관 변경)</h2>
      <p>
        운영자는 필요한 경우 약관을 변경할 수 있으며, 변경 시 서비스 내
        공지 또는 본 페이지를 통해 안내합니다. 변경 후에도 서비스를
        계속 이용하는 경우 변경된 약관에 동의한 것으로 봅니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">제8조 (문의)</h2>
      <p>
        약관 관련 문의는{" "}
        <Link href="/contact" className="underline underline-offset-2">
          문의 페이지
        </Link>
        {CONTACT_EMAIL ? (
          <>
            {" "}
            또는{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
          </>
        ) : null}
        로 연락해 주세요.
      </p>
    </LegalPageLayout>
  );
}
