"use client";

import {
  ADS_ENABLED,
  type AdPlacementId,
  getAdUnitSlot,
  GOOGLE_ADSENSE_CLIENT,
  isAdPlacementConfigured,
} from "@/lib/adConfig";
import { useEffect, useRef } from "react";

type AdSlotProps = {
  slotId: AdPlacementId;
  variant?: "top" | "inline" | "bottom";
  className?: string;
};

const VARIANT_CLASS: Record<NonNullable<AdSlotProps["variant"]>, string> = {
  top: "min-h-[70px] sm:min-h-[90px]",
  inline: "min-h-[100px] sm:min-h-[120px]",
  bottom: "min-h-[80px] sm:min-h-[100px]",
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export default function AdSlot({
  slotId,
  variant = "inline",
  className = "",
}: AdSlotProps) {
  const pushed = useRef(false);
  const configured = isAdPlacementConfigured(slotId);
  const adUnit = getAdUnitSlot(slotId);
  const showLiveAd = ADS_ENABLED && configured;

  useEffect(() => {
    if (!showLiveAd || pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense not ready */
    }
  }, [showLiveAd, adUnit]);

  if (!showLiveAd) {
    return null;
  }

  const isSide = slotId === "side-left" || slotId === "side-right";

  return (
    <aside
      data-ad-slot={slotId}
      aria-label="광고"
      className={`flex w-full items-center justify-center overflow-hidden ${VARIANT_CLASS[variant]} ${className}`}
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={adUnit}
        data-ad-format={isSide ? "vertical" : "auto"}
        data-full-width-responsive={isSide ? undefined : "true"}
      />
    </aside>
  );
}
