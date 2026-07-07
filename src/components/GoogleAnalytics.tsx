import Script from "next/script";
import { ANALYTICS_ENABLED, GA_MEASUREMENT_ID } from "@/lib/analyticsConfig";
import { consentDefaultScript } from "@/lib/consent";

export default function GoogleAnalytics() {
  if (!ANALYTICS_ENABLED) return null;

  return (
    <>
      <Script id="gtag-consent-default" strategy="beforeInteractive">
        {consentDefaultScript()}
      </Script>
      <Script
        id="gtag-loader"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-config" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}
