import Script from "next/script";
import { ADS_ENABLED, GOOGLE_ADSENSE_CLIENT } from "@/lib/adConfig";

export default function GoogleAdSense() {
  if (!ADS_ENABLED) return null;

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
