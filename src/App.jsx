import React, { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  Sparkles,
  Moon,
  Settings2,
  Loader2,
  ChevronDown,
  Stamp,
  ArrowLeft,
  Coins,
  Heart,
  HeartPulse,
  CalendarClock,
  Palette,
} from "lucide-react";

// ---------- 사주 관련 상수 (표기용) ----------
const CHEONGAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const OHAENG_OF_GAN = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토",
  기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};
const OHAENG_OF_JI = {
  자: "수", 축: "토", 인: "목", 묘: "목", 진: "토", 사: "화",
  오: "화", 미: "토", 신: "금", 유: "금", 술: "토", 해: "수",
};
const OHAENG_COLOR = { 목: "#7A9B5C", 화: "#B33A3A", 토: "#C9A961", 금: "#B8B4C8", 수: "#4C6C8C" };
const OHAENG_LABEL = { 목: "목(木)", 화: "화(火)", 토: "토(土)", 금: "금(金)", 수: "수(水)" };
const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const PILLAR_KEYS = [
  { key: "year", label: "년주" },
  { key: "month", label: "월주" },
  { key: "day", label: "일주" },
  { key: "hour", label: "시주" },
];
const ELEMENT_KEY_MAP = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

// 데모(임시) 사주 생성 — 실제 만세력 계산이 아니며, SAZU API 연동 전까지의 자리표시자
function generateMockSaju(seedStr) {
  const seed = hashSeed(seedStr);
  const pick = (arr, offset) => arr[(seed + offset * 7) % arr.length];
  const pillars = ["년주", "월주", "일주", "시주"].map((label, i) => ({
    label,
    gan: pick(CHEONGAN, i * 2 + 1),
    ji: pick(JIJI, i * 2 + 2),
  }));
  const counts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  pillars.forEach((p) => {
    counts[OHAENG_OF_GAN[p.gan]] += 1;
    counts[OHAENG_OF_JI[p.ji]] += 1;
  });
  return { pillars, counts };
}

function buildMockInterpretation(name, counts) {
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const caution = MONTHS[hashSeed(name + "caution") % 12];
  const colorMap = {
    목: ["초록", "연두"], 화: ["빨강", "주황"], 토: ["노랑", "베이지"],
    금: ["흰색", "은색"], 수: ["검정", "남색"],
  };
  return {
    total: `${name}님의 사주는 ${OHAENG_LABEL[dominant]} 기운이 두드러집니다. 전반적으로 안정적인 흐름 속에서 스스로 방향을 잘 찾아가는 해가 될 거예요.`,
    wealth: "큰 변동보다는 꾸준함이 재물운을 지켜주는 시기예요. 무리한 투자보다 계획적인 지출 관리가 유리해요.",
    love: "인연은 가까운 곳에서 자연스럽게 시작될 가능성이 높아요. 먼저 다가가는 용기가 좋은 결과로 이어질 수 있어요.",
    health: "무리한 스케줄보다 규칙적인 생활 리듬이 컨디션을 좌우해요. 수면과 휴식을 우선순위에 두세요.",
    cautionMonth: `${caution}은 평소보다 서두르지 말고 한 박자 쉬어가는 게 좋아요.`,
    luckyColors: colorMap[dominant],
  };
}

const STYLE = `
.saju-app {
  --bg-void: #0d0d14;
  --bg-panel: #1a1822;
  --bg-panel-soft: #201d29;
  --gold: #c9a13b;
  --gold-bright: #e8cd7a;
  --gold-soft: rgba(201, 161, 59, 0.3);
  --plum: #6b2c5f;
  --plum-bright: #9c5590;
  --plum-soft: rgba(107, 44, 95, 0.35);
  --ivory: #f0ece0;
  --moon: #a89f8c;
  --danger: #e0615c;
  font-family: 'Noto Sans KR', -apple-system, sans-serif;
  color: var(--ivory);
  background:
    radial-gradient(circle at 12% -8%, rgba(107, 44, 95, 0.35) 0%, transparent 45%),
    radial-gradient(circle at 88% 108%, rgba(201, 161, 59, 0.14) 0%, transparent 50%),
    var(--bg-void);
  min-height: 100%;
  position: relative;
  overflow-x: hidden;
}
.saju-app .stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1.5px 1.5px at 10% 15%, rgba(232,205,122,0.55), transparent),
    radial-gradient(1px 1px at 30% 40%, rgba(240,236,224,0.3), transparent),
    radial-gradient(1.5px 1.5px at 70% 20%, rgba(232,205,122,0.4), transparent),
    radial-gradient(1px 1px at 85% 60%, rgba(240,236,224,0.28), transparent),
    radial-gradient(1.5px 1.5px at 50% 80%, rgba(156,85,144,0.4), transparent),
    radial-gradient(1px 1px at 15% 75%, rgba(240,236,224,0.25), transparent);
  pointer-events: none;
}
.saju-app .grain {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.saju-app .display {
  font-family: 'Gowun Batang', 'Noto Serif KR', serif;
}
.saju-app .wrap {
  position: relative;
  max-width: 560px;
  margin: 0 auto;
  padding: 48px 20px 64px;
}
.saju-app .eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gold-bright);
  font-size: 13px;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
}
.saju-app h1.display {
  font-size: 30px;
  font-weight: 900;
  line-height: 1.35;
  margin: 0 0 8px;
}
.saju-app .subtitle {
  color: var(--moon);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 32px;
}
.saju-app .panel {
  background: linear-gradient(160deg, var(--bg-panel) 0%, var(--bg-panel-soft) 100%);
  border: 1px solid var(--gold-soft);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px -20px rgba(0,0,0,0.6);
}
.saju-app .panel + .panel { margin-top: 16px; }
.saju-app label.field-label {
  display: block;
  font-size: 13px;
  color: var(--moon);
  margin: 18px 0 8px;
}
.saju-app label.field-label:first-of-type { margin-top: 0; }
.saju-app input[type="text"],
.saju-app input[type="date"],
.saju-app input[type="time"],
.saju-app input[type="password"] {
  width: 100%;
  box-sizing: border-box;
  background: rgba(13, 13, 20, 0.6);
  border: 1px solid var(--gold-soft);
  border-radius: 10px;
  padding: 11px 13px;
  color: var(--ivory);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease;
}
.saju-app input:focus {
  border-color: var(--gold-bright);
}
.saju-app input.error {
  border-color: var(--danger);
}
.saju-app .field-error {
  color: var(--danger);
  font-size: 12px;
  margin-top: 6px;
}
.saju-app .toggle-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.saju-app .toggle-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--gold-soft);
  background: transparent;
  color: var(--moon);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.saju-app .toggle-btn.active {
  background: var(--plum-soft);
  border-color: var(--plum-bright);
  color: var(--ivory);
}
.saju-app .checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 13px;
  color: var(--moon);
}
.saju-app .checkbox-row input { accent-color: var(--gold); }
.saju-app .advanced-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--moon);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  margin-top: 20px;
}
.saju-app .advanced-toggle .chev { transition: transform 0.15s ease; }
.saju-app .advanced-toggle.open .chev { transform: rotate(180deg); }
.saju-app .advanced-body {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--gold-soft);
}
.saju-app .hint {
  font-size: 11.5px;
  color: var(--moon);
  line-height: 1.6;
  margin-top: 6px;
}
.saju-app .submit-btn {
  width: 100%;
  margin-top: 24px;
  padding: 15px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%);
  color: #1c1508;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Gowun Batang', 'Noto Serif KR', serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.1s ease, box-shadow 0.15s ease;
  box-shadow: 0 10px 24px -10px rgba(201, 161, 59, 0.6);
}
.saju-app .submit-btn:hover { transform: translateY(-1px); }
.saju-app .submit-btn:disabled { opacity: 0.6; cursor: default; transform: none; }
.saju-app .loading-wrap {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--moon);
  text-align: center;
}
.saju-app .spin { animation: saju-spin 1.2s linear infinite; color: var(--gold-bright); }
@keyframes saju-spin { to { transform: rotate(360deg); } }
.saju-app .back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--gold-soft);
  border-radius: 999px;
  color: var(--gold-bright);
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 18px;
  padding: 7px 14px;
  transition: border-color 0.15s ease;
}
.saju-app .back-btn:hover { border-color: var(--gold-bright); }
.saju-app .result-name {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 2px;
}
.saju-app .result-sub {
  color: var(--moon);
  font-size: 13px;
  margin: 0 0 20px;
}
.saju-app .demo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--gold-bright);
  border: 1px solid var(--gold-soft);
  border-radius: 999px;
  padding: 4px 10px;
  margin-bottom: 18px;
}
.saju-app .pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 6px;
}
.saju-app .pillar-col { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.saju-app .pillar-label {
  font-size: 11px;
  color: var(--moon);
  margin-bottom: 2px;
}
.saju-app .seal {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Gowun Batang', 'Noto Serif KR', serif;
  font-weight: 900;
  font-size: 22px;
  position: relative;
  border: 1.5px solid var(--gold);
  background:
    radial-gradient(circle at 35% 30%, rgba(107,44,95,0.35), transparent 60%),
    var(--bg-panel-soft);
  color: var(--ivory);
}
.saju-app .seal::after {
  content: "";
  position: absolute;
  inset: 4px;
  border: 1px solid var(--gold-soft);
  border-radius: 8px;
}
.saju-app .seal-el {
  position: absolute;
  bottom: 5px;
  right: 6px;
  font-size: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  opacity: 0.75;
}
.saju-app .chart-wrap { width: 100%; height: 230px; margin: 6px 0 -10px; }
.saju-app .legend-row {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.saju-app .legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--moon);
}
.saju-app .legend-dot { width: 9px; height: 9px; border-radius: 50%; }
.saju-app .section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Gowun Batang', 'Noto Serif KR', serif;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--gold-bright);
}
.saju-app .section-body {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--ivory);
  opacity: 0.92;
  margin: 0;
}
.saju-app .color-chips { display: flex; gap: 8px; margin-top: 10px; }
.saju-app .color-chip {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--gold-soft);
  color: var(--ivory);
}
.saju-app .error-text {
  color: var(--danger);
  font-size: 12.5px;
  margin-top: 10px;
  line-height: 1.6;
}
`;

export default function SajuApp() {
  const [screen, setScreen] = useState("input"); // input | loading | result
  const [name, setName] = useState("");
  const [calendarType, setCalendarType] = useState("solar"); // solar | lunar
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [sazuKey, setSazuKey] = useState(import.meta.env.VITE_SAZU_API_KEY ?? "");
  const [openrouterKey, setOpenrouterKey] = useState(import.meta.env.VITE_OPENROUTER_API_KEY ?? "");

  const [result, setResult] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [errorNote, setErrorNote] = useState("");

  const canSubmit = name.trim() && birthDate && (timeUnknown || birthTime);

  async function callSazuApi() {
    const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
    const body = {
      birthYear,
      birthMonth,
      birthDay,
      isLunar: calendarType === "lunar",
    };
    if (!timeUnknown && birthTime) {
      const [birthHour, birthMinute] = birthTime.split(":").map(Number);
      body.birthHour = birthHour;
      body.birthMinute = birthMinute;
    }
    const res = await fetch("https://api.sazu.app/v1/sazu/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": sazuKey,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data?.error?.message || `SAZU API 응답 오류 (${res.status})`);
    }
    return data.data;
  }

  function mapSazuResponse(sazuData) {
    const fourPillars = sazuData.modules.fourPillars;
    const pillars = PILLAR_KEYS.map(({ key, label }) => {
      const p = fourPillars[key];
      return p ? { label, gan: p.sky, ji: p.earth } : null;
    }).filter(Boolean);

    const elements = sazuData.modules.elements;
    const counts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    Object.entries(ELEMENT_KEY_MAP).forEach(([apiKey, label]) => {
      counts[label] = elements[apiKey]?.total?.count ?? 0;
    });

    return { pillars, counts };
  }

  async function callOpenRouter(sajuSummary) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openrouterKey}`,
      },
      body: JSON.stringify({
        model: "google/gemma-4-31b-it:free",
        messages: [
          {
            role: "user",
            content: `다음 사주 정보를 참고해서 재미 위주로 한국어 해석을 JSON으로만 응답해줘. 키: total, wealth, love, health, cautionMonth, luckyColors(배열). 사주 정보: ${JSON.stringify(
              sajuSummary
            )}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenRouter API 응답 오류 (${res.status})`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "{}";
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setScreen("loading");
    setErrorNote("");
    let demo = false;
    let pillars, counts, interpretation;

    try {
      if (!sazuKey) throw new Error("SAZU API 키가 입력되지 않았습니다.");
      const sazuData = await callSazuApi();
      ({ pillars, counts } = mapSazuResponse(sazuData));
    } catch (e) {
      demo = true;
      const mock = generateMockSaju(name + birthDate + birthTime);
      pillars = mock.pillars;
      counts = mock.counts;
    }

    try {
      if (!openrouterKey) throw new Error("OpenRouter API 키가 입력되지 않았습니다.");
      interpretation = await callOpenRouter({ name, pillars, counts });
    } catch (e) {
      demo = true;
      interpretation = buildMockInterpretation(name, counts);
    }

    setIsDemo(demo);
    setErrorNote(
      demo
        ? "API 키가 없거나 요청이 제한되어 일부 데모 데이터로 대체되었습니다. 상단 '고급 설정'에서 API 키를 입력하면 실제 결과를 볼 수 있어요."
        : ""
    );
    setResult({ pillars, counts, interpretation });
    setScreen("result");
  }

  function reset() {
    setScreen("input");
    setResult(null);
    setErrorNote("");
  }

  const chartData = result
    ? Object.entries(result.counts).map(([key, value]) => ({
        subject: OHAENG_LABEL[key],
        value,
        fullMark: 5,
      }))
    : [];

  return (
    <div className="saju-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
        ${STYLE}
      `}</style>
      <div className="stars" />
      <div className="grain" />

      {screen === "input" && (
        <div className="wrap">
          <div className="eyebrow">
            <Moon size={14} />
            무료 사주팔자
          </div>
          <h1 className="display">태어난 순간의 기운,<br />지금 확인해보세요</h1>
          <p className="subtitle">
            이름과 생년월일시만 입력하면 나만의 사주팔자와 AI 해석을 바로 볼 수 있어요.
          </p>

          <div className="panel">
            <label className="field-label">이름</label>
            <input
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="field-label">양력 / 음력</label>
            <div className="toggle-row">
              <button
                className={`toggle-btn ${calendarType === "solar" ? "active" : ""}`}
                onClick={() => setCalendarType("solar")}
              >
                양력
              </button>
              <button
                className={`toggle-btn ${calendarType === "lunar" ? "active" : ""}`}
                onClick={() => setCalendarType("lunar")}
              >
                음력
              </button>
            </div>

            <label className="field-label">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />

            <label className="field-label">태어난 시간</label>
            <input
              type="time"
              value={birthTime}
              disabled={timeUnknown}
              onChange={(e) => setBirthTime(e.target.value)}
              style={timeUnknown ? { opacity: 0.4 } : undefined}
            />
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="time-unknown"
                checked={timeUnknown}
                onChange={(e) => setTimeUnknown(e.target.checked)}
              />
              <label htmlFor="time-unknown">태어난 시간을 몰라요</label>
            </div>

            <button
              className={`advanced-toggle ${advancedOpen ? "open" : ""}`}
              onClick={() => setAdvancedOpen((v) => !v)}
            >
              <Settings2 size={13} />
              고급 설정 (API 키 입력)
              <ChevronDown size={13} className="chev" />
            </button>
            {advancedOpen && (
              <div className="advanced-body">
                <label className="field-label" style={{ marginTop: 0 }}>
                  SAZU API 키
                </label>
                <input
                  type="password"
                  placeholder="sazu API key"
                  value={sazuKey}
                  onChange={(e) => setSazuKey(e.target.value)}
                />
                <label className="field-label">OpenRouter API 키</label>
                <input
                  type="password"
                  placeholder="sk-or-..."
                  value={openrouterKey}
                  onChange={(e) => setOpenrouterKey(e.target.value)}
                />
                <p className="hint">
                  키를 입력하지 않으면 데모 데이터로 결과를 보여드려요. 입력한 키는 저장되지 않고
                  이 화면을 벗어나면 사라져요.
                </p>
              </div>
            )}

            <button className="submit-btn" disabled={!canSubmit} onClick={handleSubmit}>
              <Sparkles size={16} />
              내 사주 확인하기
            </button>
          </div>
        </div>
      )}

      {screen === "loading" && (
        <div className="loading-wrap">
          <Loader2 size={30} className="spin" />
          <p>사주를 풀이하는 중이에요…</p>
        </div>
      )}

      {screen === "result" && result && (
        <div className="wrap">
          <button className="back-btn" onClick={reset}>
            <ArrowLeft size={14} />
            다시 입력하기
          </button>
          <p className="result-name display">{name}님의 사주팔자</p>
          <p className="result-sub">
            {calendarType === "solar" ? "양력" : "음력"} {birthDate}{" "}
            {timeUnknown ? "· 태어난 시간 모름" : `· ${birthTime}`}
          </p>
          {isDemo && (
            <div className="demo-badge">
              <Stamp size={12} />
              데모 데이터
            </div>
          )}

          <div className="panel">
            <div className="section-title">
              <Stamp size={15} />
              사주 여덟 글자
            </div>
            <div
              className="pillars-grid"
              style={{ gridTemplateColumns: `repeat(${result.pillars.length}, 1fr)` }}
            >
              {result.pillars.map((p) => (
                <div className="pillar-col" key={p.label}>
                  <span className="pillar-label">{p.label}</span>
                  <div className="seal">
                    {p.gan}
                    <span className="seal-el">{OHAENG_OF_GAN[p.gan]}</span>
                  </div>
                  <div className="seal">
                    {p.ji}
                    <span className="seal-el">{OHAENG_OF_JI[p.ji]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-title">
              <Sparkles size={15} />
              오행 분포
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} outerRadius="72%">
                  <PolarGrid stroke="rgba(201,161,59,0.25)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#f0ece0", fontSize: 12 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#e8cd7a"
                    fill="#c9a13b"
                    fillOpacity={0.45}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="legend-row">
              {Object.entries(OHAENG_COLOR).map(([key, color]) => (
                <div className="legend-item" key={key}>
                  <span className="legend-dot" style={{ background: color }} />
                  {OHAENG_LABEL[key]} {result.counts[key]}
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-title">
              <Sparkles size={15} />총운
            </div>
            <p className="section-body">{result.interpretation.total}</p>
          </div>

          <div className="panel">
            <div className="section-title">
              <Coins size={15} />
              재물운
            </div>
            <p className="section-body">{result.interpretation.wealth}</p>
          </div>

          <div className="panel">
            <div className="section-title">
              <Heart size={15} />
              애정운
            </div>
            <p className="section-body">{result.interpretation.love}</p>
          </div>

          <div className="panel">
            <div className="section-title">
              <HeartPulse size={15} />
              건강운
            </div>
            <p className="section-body">{result.interpretation.health}</p>
          </div>

          <div className="panel">
            <div className="section-title">
              <CalendarClock size={15} />
              올해 조심해야 하는 달
            </div>
            <p className="section-body">{result.interpretation.cautionMonth}</p>
          </div>

          <div className="panel">
            <div className="section-title">
              <Palette size={15} />
              가까이 두면 좋은 색상
            </div>
            <div className="color-chips">
              {result.interpretation.luckyColors.map((c) => (
                <span className="color-chip" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {errorNote && <p className="error-text">{errorNote}</p>}
        </div>
      )}
    </div>
  );
}
