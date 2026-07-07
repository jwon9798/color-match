/** 사이트 공통 설정 */
export const SITE_NAME = "컬러 매처";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://color-matcher.jwonlabs.com";
export const SITE_DESCRIPTION =
  "물감(R·G·B·W)을 섞어 타겟 색상과 가장 비슷한 색을 만드는 무료 브라우저 색감 게임입니다. 설치 없이 PC·태블릿·스마트폰에서 플레이하세요.";

export const OPERATOR_NAME = "JWON Labs";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "jwon9798@gmail.com";

/** JWON Labs 공통 개인정보 처리방침 */
export const JWONLABS_PRIVACY_URL = "https://jwonlabs.com/privacy.html";

/** Google Analytics 4 측정 ID */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-C24JK5CTF0";

export const LEGAL_PAGES = [
  { href: "/guide", label: "게임 가이드" },
  { href: "/about", label: "소개" },
  { href: "/contact", label: "문의" },
  { href: "/privacy", label: "개인정보 처리방침" },
  { href: "/terms", label: "이용약관" },
] as const;
