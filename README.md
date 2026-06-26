# 컬러 매처

물감(R·G·B·W)을 섞어 타겟 색과 맞추는 웹 게임입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## 광고 (Google AdSense)

1. [Google AdSense](https://www.google.com/adsense/)에서 사이트 등록 및 승인
2. **Vercel Environment Variables** (심사 전 필수):
   - `NEXT_PUBLIC_CONTACT_EMAIL` — 운영자 이메일 (문의·개인정보 처리방침에 표시)
   - `NEXT_PUBLIC_SITE_URL` — `https://color-match-tan.vercel.app`
3. 심사용 필수 페이지: `/guide`, `/about`, `/contact`, `/privacy`, `/terms`
4. **광고 단위** 생성 (반응형 디스플레이 권장) 후 `.env.example` 참고해 SLOT 설정
5. 배포 후 `ads.txt`는 `/ads.txt`에서 자동 제공, `sitemap.xml`·`robots.txt` 제공

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | **AdSense 심사 필수** — 운영자 연락 이메일 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (sitemap·OG) |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` | 발행자 ID (`ca-pub-...`) |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT` | 기본 광고 단위 ID |
| `NEXT_PUBLIC_ADS_ENABLED` | `false`면 광고 끔 |

개발 모드에서는 AdSense 미설정 시 점선 플레이스홀더가 표시됩니다. 프로덕션에서는 env 미설정 시 광고 영역이 숨겨집니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |
