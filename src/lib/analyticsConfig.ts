/** Google Analytics 4 측정 ID */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-C24JK5CTF0";

export const ANALYTICS_ENABLED =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false" &&
  GA_MEASUREMENT_ID.length > 0;
