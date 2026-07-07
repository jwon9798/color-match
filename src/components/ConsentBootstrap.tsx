"use client";

import { applyConsent, getStoredConsent } from "@/lib/consent";
import { useEffect } from "react";

export default function ConsentBootstrap() {
  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) applyConsent(stored);
  }, []);

  return null;
}
