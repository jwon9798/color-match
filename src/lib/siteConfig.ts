/** 사이트 공통 설정 — Vercel env로 연락처 등 덮어쓰기 */
export const SITE_NAME = "컬러 매처";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://color-match-tan.vercel.app";
export const SITE_DESCRIPTION =
  "물감(R·G·B·W)을 섞어 타겟 색상과 가장 비슷한 색을 만드는 무료 브라우저 색감 게임입니다.";

/** AdSense 심사·문의용 — Vercel env로 덮어쓸 수 있음 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "jwon9798@gmail.com";

export const LEGAL_PAGES = [
  { href: "/guide", label: "게임 가이드" },
  { href: "/about", label: "소개" },
  { href: "/contact", label: "문의" },
  { href: "/privacy", label: "개인정보 처리방침" },
  { href: "/terms", label: "이용약관" },
] as const;
