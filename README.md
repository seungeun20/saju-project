# 사주팔자 - 무료 사주 풀이

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

입력 화면의 "고급 설정"에서 아래 키를 입력하면 데모 데이터 대신 실제 결과를 볼 수 있습니다. 입력한 키는 저장되지 않고 화면을 벗어나면 사라집니다.

- **SAZU API 키** — 사주(만세력) 계산
- **OpenRouter API 키** — AI 기반 해석 생성
