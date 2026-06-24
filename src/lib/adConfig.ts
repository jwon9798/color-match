export type AdPlacementId =
  | "home-top"
  | "home-bottom"
  | "play-top"
  | "play-mid"
  | "play-bottom"
  | "result-top"
  | "result-inline"
  | "result-bottom"
  | "final-top"
  | "final-inline"
  | "final-bottom"
  | "side-left"
  | "side-right";

/** Google AdSense publisher ID (ads.txt) */
export const GOOGLE_ADSENSE_PUBLISHER_ID = "pub-4911271163170466";

/** Google AdSense client ID (광고 스크립트용 ca-pub-...) */
export const GOOGLE_ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT ??
  "ca-pub-4911271163170466";

export const ADS_ENABLED =
  process.env.NEXT_PUBLIC_ADS_ENABLED !== "false" &&
  GOOGLE_ADSENSE_CLIENT.length > 0;

const DEFAULT_SLOT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT ?? "";

const SLOT_ENV_KEYS: Record<AdPlacementId, string> = {
  "home-top": "NEXT_PUBLIC_AD_SLOT_HOME_TOP",
  "home-bottom": "NEXT_PUBLIC_AD_SLOT_HOME_BOTTOM",
  "play-top": "NEXT_PUBLIC_AD_SLOT_PLAY_TOP",
  "play-mid": "NEXT_PUBLIC_AD_SLOT_PLAY_MID",
  "play-bottom": "NEXT_PUBLIC_AD_SLOT_PLAY_BOTTOM",
  "result-top": "NEXT_PUBLIC_AD_SLOT_RESULT_TOP",
  "result-inline": "NEXT_PUBLIC_AD_SLOT_RESULT_INLINE",
  "result-bottom": "NEXT_PUBLIC_AD_SLOT_RESULT_BOTTOM",
  "final-top": "NEXT_PUBLIC_AD_SLOT_FINAL_TOP",
  "final-inline": "NEXT_PUBLIC_AD_SLOT_FINAL_INLINE",
  "final-bottom": "NEXT_PUBLIC_AD_SLOT_FINAL_BOTTOM",
  "side-left": "NEXT_PUBLIC_AD_SLOT_SIDE_LEFT",
  "side-right": "NEXT_PUBLIC_AD_SLOT_SIDE_RIGHT",
};

export function getAdUnitSlot(placement: AdPlacementId): string {
  const envKey = SLOT_ENV_KEYS[placement];
  return process.env[envKey] ?? DEFAULT_SLOT;
}

export function isAdPlacementConfigured(placement: AdPlacementId): boolean {
  return getAdUnitSlot(placement).length > 0;
}

export function getAdsTxtPublisherId(): string {
  return (
    process.env.GOOGLE_ADSENSE_PUBLISHER_ID ?? GOOGLE_ADSENSE_PUBLISHER_ID
  );
}

export function getAdsTxtContent(): string {
  return `google.com, ${getAdsTxtPublisherId()}, DIRECT, f08c47fec0942fa0\n`;
}
