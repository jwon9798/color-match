import LegalPageLayout from "@/components/LegalPageLayout";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/siteConfig";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "게임 가이드",
  description:
    "컬러 매처 플레이 방법, 점수 기준, 물감 섞기 팁, 자주 묻는 질문(FAQ)을 안내합니다.",
};

export default function GuidePage() {
  return (
    <LegalPageLayout title="게임 가이드" updated="2026년 6월 24일">
      <p>
        {SITE_NAME}는 빨강(R), 초록(G), 파랑(B), 흰(W) 물감 네 가지를 팔레트에
        섞어, 화면에 제시된 <strong>타겟 색상</strong>과 가장 비슷한 색을
        만들어 맞추는 무료 웹 게임입니다. 회원가입이나 앱 설치 없이 브라우저에서
        바로 플레이할 수 있습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">플레이 방법</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          메인 화면에서 <strong>시작하기</strong>(1문제), <strong>10문제</strong>,
          또는 <strong>20문제</strong> 모드를 선택합니다.
        </li>
        <li>
          상단에 표시된 타겟 색상을 확인한 뒤, 팔레트에 R·G·B·W 물감을
          드래그하여 덧칠합니다.
        </li>
        <li>
          <strong>Blend(섞기)</strong> 도구로 물감 경계를 문지르면 색이
          자연스럽게 혼합됩니다.
        </li>
        <li>
          <strong>Pick(스포이드)</strong>로 팔레트에서 원하는 색 지점을
          클릭해 선택합니다.
        </li>
        <li>
          선택한 색이 타겟과 충분히 비슷하다고 판단되면{" "}
          <strong>제출하기</strong>를 눌러 점수를 확인합니다.
        </li>
      </ol>

      <h2 className="pt-2 text-base font-semibold">점수·등급 기준</h2>
      <p>
        제출한 색과 타겟 색은 OKLCH 색공간에서 밝기·색상·채도를 비교해 0~100%
        일치율로 계산합니다. 선명한 색일수록 색상(hue) 차이를 더 중요하게
        반영합니다.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>S등급</strong>: 94% 이상 — 육안으로 거의 구분하기 어려운
          수준
        </li>
        <li>
          <strong>A등급</strong>: 86% 이상 — 매우 비슷한 색
        </li>
        <li>
          <strong>B등급</strong>: 70% 이상 — 꽤 가까운 색
        </li>
        <li>
          <strong>C등급</strong>: 45% 이상 — 차이가 느껴지는 수준
        </li>
        <li>
          <strong>D등급</strong>: 45% 미만 — 다시 도전 권장
        </li>
      </ul>
      <p>
        10·20문제 모드에서는 각 문제 점수의 평균이 최종 점수로 표시됩니다.
        결과 화면의 <strong>공유하기</strong> 버튼으로 점수를 친구에게
        공유할 수 있습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">물감 섞기 팁</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>밝은 색</strong>은 흰(W) 물감을, <strong>어두운 색</strong>은
          원색(R·G·B) 비율을 높여 만듭니다.
        </li>
        <li>
          <strong>주황·보라·올리브</strong> 등 2차색은 서로 마주 보는 색이
          아닌 인접 원색을 섞는 것이 자연스럽습니다.
        </li>
        <li>
          한 번에 많이 칠하기보다 여러 번 얇게 칠한 뒤 Blend로 경계를
          문지르면 균일한 색을 얻기 쉽습니다.
        </li>
        <li>
          색이 마음에 들지 않으면 <strong>팔레트 초기화</strong> 후 다시
          시작할 수 있습니다.
        </li>
      </ul>

      <h2 className="pt-2 text-base font-semibold">자주 묻는 질문 (FAQ)</h2>
      <dl className="space-y-4">
        <div>
          <dt className="font-semibold">게임이 저장되나요?</dt>
          <dd className="mt-1 text-amber-900/85">
            진행 기록은 브라우저 세션 안에서만 유지됩니다. 서버에 개인
            플레이 기록을 저장하지 않습니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">모바일에서도 할 수 있나요?</dt>
          <dd className="mt-1 text-amber-900/85">
            네. 터치로 물감 칠하기·섞기·색 선택이 가능하도록 제작되었습니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">타겟 색은 어떻게 정해지나요?</dt>
          <dd className="mt-1 text-amber-900/85">
            R·G·B·W 물감으로 팔레트에서 만들 수 있는 색 범위 안에서 무작위로
            생성됩니다. 이론상 항상 맞출 수 있는 색입니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">광고가 표시되나요?</dt>
          <dd className="mt-1 text-amber-900/85">
            현재 광고는 게재하지 않으며 <strong>무료</strong>로 이용할 수
            있습니다. 향후 광고가 도입될 경우{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              개인정보 처리방침
            </Link>
            을 통해 안내합니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">문의는 어디로 하나요?</dt>
          <dd className="mt-1 text-amber-900/85">
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
          </dd>
        </div>
      </dl>

      <p className="pt-2">
        지금 바로{" "}
        <Link href="/play/single" className="font-medium underline underline-offset-2">
          게임 시작하기 →
        </Link>
      </p>
    </LegalPageLayout>
  );
}
