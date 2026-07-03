# 컬러 매처 (Color Matcher)

물감(R·G·B·W)을 섞어 타겟 색과 맞추는 무료 웹 게임입니다.

- **URL:** https://color-matcher.jwonlabs.com
- **Worker:** `color-matcher` (Cloudflare Workers + OpenNext)
- **Repo:** jwon9798/color-match

## 로컬 실행

```bash
npm install
npm run dev
```

## Cloudflare 배포

`master` 브랜치 push 시 GitHub Actions가 자동 배포합니다.

### GitHub Secrets (필수)

| Secret | 설명 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Workers Deploy 권한 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 계정 ID |

### 수동 배포

```bash
npm run deploy
```

환경 변수 `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` 필요.

## AdSense

- Publisher: `pub-4911271163170466`
- Client: `ca-pub-4911271163170466`
- `/ads.txt` — 서브도메인 루트에 제공
- jwonlabs.com 루트 `ads.txt`에 `subdomain=color-matcher.jwonlabs.com` 추가 권장

### 심사용 페이지

| 경로 | 설명 |
|------|------|
| `/guide` | 게임 가이드·FAQ |
| `/about` | 서비스 소개 |
| `/contact` | 문의 (jwon9798@gmail.com) |
| `/privacy` | 서비스 개인정보 처리방침 |
| `/terms` | 이용약관 |

공통 방침: https://jwonlabs.com/privacy.html

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | Next.js 개발 서버 |
| `npm run build` | Next.js 빌드 |
| `npm run preview` | Cloudflare Workers 로컬 프리뷰 |
| `npm run deploy` | OpenNext 빌드 + Cloudflare 배포 |
| `npm run lint` | ESLint |
