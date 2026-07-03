# Cloudflare 배포 (color-matcher.jwonlabs.com)

## 배포 정보

| 항목 | 값 |
|------|-----|
| 도메인 | https://color-matcher.jwonlabs.com |
| Worker | `color-matcher` |
| Repo | jwon9798/color-match |
| 스택 | Next.js 16 + @opennextjs/cloudflare + wrangler |

## 자동 배포

`master` push → `.github/workflows/deploy-cloudflare.yml`

## 수동으로 해야 하는 것 (사용자)

### 1. jwonlabs.com 루트 ads.txt (mainpage repo)

AdSense 서브도메인 인증용 — **mainpage** 저장소의 `public/ads.txt` 또는 `ads.txt`에 추가:

```
subdomain=color-matcher.jwonlabs.com
```

(기존 `google.com, pub-...` 줄은 유지)

### 2. AdSense 사이트 URL

승인 심사 시 URL을 `https://color-matcher.jwonlabs.com`으로 등록/변경.

### 3. DNS

`color-matcher.jwonlabs.com`은 wrangler `custom_domain: true`로 Workers 배포 시 Cloudflare가 자동 처리합니다. **jwonlabs.com 존이 같은 Cloudflare 계정**에 있어야 합니다.

### 4. GitHub Secrets (완료했다면 스킵)

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 로컬 프리뷰

```bash
npm run preview
```

## 문제 해결

- `_headers`에 `/*` 주석 블록 사용 금지 (배포 실패)
- Workers `_redirects`로 도메인 간 리다이렉트 불가 → Bulk Redirects 사용
