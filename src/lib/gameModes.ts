export type GameModeId = "single" | "marathon-10" | "marathon-20";

export type GameModeConfig = {
  id: GameModeId;
  title: string;
  subtitle: string;
  description: string;
  totalQuestions: number;
  emoji: string;
};

export const GAME_MODES: Record<GameModeId, GameModeConfig> = {
  single: {
    id: "single",
    title: "컬러 매처",
    subtitle: "한 팔레트 챌린지",
    description: "타겟 색 하나를 맞추는 클래식 모드",
    totalQuestions: 1,
    emoji: "🎨",
  },
  "marathon-10": {
    id: "marathon-10",
    title: "10문제",
    subtitle: "연속 10문제",
    description: "10가지 색을 연속으로 맞추고 평균 점수를 겨루세요",
    totalQuestions: 10,
    emoji: "🔥",
  },
  "marathon-20": {
    id: "marathon-20",
    title: "20문제",
    subtitle: "연속 20문제",
    description: "20문제 풀 풀코스! 최종 평균 100점 만점",
    totalQuestions: 20,
    emoji: "👑",
  },
};

export const GAME_MODE_IDS = Object.keys(GAME_MODES) as GameModeId[];

export function isGameModeId(value: string): value is GameModeId {
  return value in GAME_MODES;
}

export function averageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}
