# 사주팔자 - 무료 사주 풀이

[![GitHub repo](https://img.shields.io/badge/GitHub-saju--project-181717?logo=github)](https://github.com/seungeun20/saju-project)

이름과 생년월일시를 입력하면 사주팔자(년/월/일/시주)와 오행 분포, AI 기반 해석(총운·재물운·애정운·건강운·주의할 달·행운의 색)을 보여주는 React 웹 앱입니다.

## 주요 기능

- 양력/음력 생년월일시 입력
- 사주 여덟 글자와 오행(목·화·토·금·수) 레이더 차트 시각화
- SAZU API, OpenRouter API 키를 입력하면 실제 사주 계산과 AI 해석 결과를 받아볼 수 있음
- API 키가 없거나 요청이 실패하면 데모 데이터로 자동 대체

## 기술 스택

- [React](https://react.dev/) 18
- [Vite](https://vitejs.dev/)
- [Recharts](https://recharts.org/) — 오행 분포 레이더 차트
- [lucide-react](https://lucide.dev/) — 아이콘

## 시작하기

```bash
npm install
npm run dev
```

### 빌드

```bash
npm run build
npm run preview
```

## API 키 (선택)

API 키가 없어도 데모 데이터로 정상 동작합니다. 실제 결과를 받으려면 아래 두 가지 방법 중 하나로 키를 넣을 수 있습니다.

**⚠️ 절대로 API 키를 코드나 README에 직접 적어서 커밋하지 마세요.** 이 저장소는 Public이라 누구나 볼 수 있고, 삭제해도 git 히스토리에 남습니다.

### 방법 1. 화면에서 직접 입력 (가장 안전)

입력 화면의 "고급 설정"에서 키를 입력하면 됩니다. 이 값은 브라우저 메모리에만 있다가 API 요청에 쓰이고, 저장되거나 커밋되지 않으며 화면을 벗어나면 사라집니다.

### 방법 2. 로컬 개발 시 `.env`로 기본값 설정

1. `.env.example`을 복사해 `.env` 파일을 만듭니다.

   ```bash
   cp .env.example .env
   ```

2. `.env`에 실제 키를 채워 넣습니다.

   ```
   VITE_SAZU_API_KEY=your-sazu-key
   VITE_OPENROUTER_API_KEY=your-openrouter-key
   ```

3. `npm run dev` 실행 시 "고급 설정" 입력란에 자동으로 채워집니다.

`.env`는 `.gitignore`에 등록되어 있어 git에 커밋되지 않습니다.

### 배포된 사이트(Vercel)에 기본 키를 넣고 싶다면

Vercel 대시보드 → Project Settings → Environment Variables에 `VITE_SAZU_API_KEY`, `VITE_OPENROUTER_API_KEY`를 등록하세요. 코드나 저장소에는 노출되지 않습니다.

- **SAZU API 키** — 사주(만세력) 계산
- **OpenRouter API 키** — AI 기반 해석 생성
