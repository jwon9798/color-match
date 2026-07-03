import LegalPageLayout from "@/components/LegalPageLayout";
import {
  CONTACT_EMAIL,
  JWONLABS_PRIVACY_URL,
  OPERATOR_NAME,
  SITE_NAME,
  SITE_URL,
} from "@/lib/siteConfig";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "소개",
  description:
    "컬러 매처는 물감을 섞어 색감을 맞추는 무료 웹 게임입니다. 미술·디자인 감각을 가볍게 테스트해 보세요.",
};

export default function AboutPage() {
  return (
    <LegalPageLayout title="서비스 소개" updated="2026년 7월 3일">
      <p>
        <strong>{SITE_NAME}</strong>({SITE_URL})는 {OPERATOR_NAME}가 운영하는
        무료 <strong>색감 매칭 웹 게임</strong>입니다. 미술 수업의 색 혼합
        실습처럼, 빨강·초록·파랑·흰 물감을 팔레트에 섞어 목표 색과 얼마나
        가깝게 맞출 수 있는지 도전합니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">만든 이유</h2>
      <p>
        색을 섞어 원하는 색을 만드는 과정은 디자이너·일러스트레이터·미술
        학습자에게 익숙한 훈련입니다. {SITE_NAME}는 그 경험을 가볍게
        게임화하여, 짧은 휴식 시간에도 색에 대한 감각을 즐겁게 다듬을 수
        있도록 만들었습니다.
      </p>

      <h2 className="pt-2 text-base font-semibold">주요 특징</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>회원가입·로그인 없이 무료 이용</li>
        <li>PC·태블릿·스마트폰 브라우저 지원</li>
        <li>1문제 / 10문제 / 20문제 챌린지 모드</li>
        <li>OKLCH 기반 색상 유사도 채점</li>
        <li>결과 공유 기능</li>
      </ul>

      <h2 className="pt-2 text-base font-semibold">운영 정보</h2>
      <p>
        {SITE_NAME}는 {OPERATOR_NAME}(
        <a
          href="https://jwonlabs.com"
          className="underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          jwonlabs.com
        </a>
        )에서 제공하는 웹 서비스입니다. 버그 신고, 제휴·광고 문의는{" "}
        <Link href="/contact" className="underline underline-offset-2">
          문의 페이지
        </Link>{" "}
        또는{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="underline underline-offset-2"
        >
          {CONTACT_EMAIL}
        </a>
        로 보내 주세요.
      </p>

      <h2 className="pt-2 text-base font-semibold">관련 페이지</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <Link href="/guide" className="underline underline-offset-2">
            게임 가이드 및 FAQ
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="underline underline-offset-2">
            개인정보 처리방침
          </Link>
        </li>
        <li>
          <a
            href={JWONLABS_PRIVACY_URL}
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            JWON Labs 공통 개인정보 처리방침
          </a>
        </li>
        <li>
          <Link href="/terms" className="underline underline-offset-2">
            이용약관
          </Link>
        </li>
      </ul>
    </LegalPageLayout>
  );
}
