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
2. **광고 단위** 생성 (반응형 디스플레이 권장)
3. `.env.example`을 `.env.local`로 복사 후 값 입력:

```env
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT=1234567890
```

4. 배포 후 AdSense에서 사이트 소유 확인 (`ads.txt`는 `/ads.txt`에서 자동 제공)
5. **개인정보 처리방침** 페이지: `/privacy` (AdSense 필수)

개발 모드에서는 AdSense 미설정 시 점선 플레이스홀더가 표시됩니다. 프로덕션에서는 env 미설정 시 광고 영역이 숨겨집니다.

## Vercel 배포

```bash
npm run build
npx vercel login
npx vercel --prod
```

Vercel 대시보드 → Project → Settings → Environment Variables에 AdSense 변수를 추가한 뒤 **Redeploy** 하세요.

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` | 발행자 ID (`ca-pub-...`) |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT` | 기본 광고 단위 ID |
| `NEXT_PUBLIC_ADS_ENABLED` | `false`면 광고 끔 |

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |
