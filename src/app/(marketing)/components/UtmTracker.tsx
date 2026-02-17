"use client";

import { useEffect } from "react";
import { captureUtmParamsFromUrl } from "@/lib/marketing/utm";

export function UtmTracker() {
  useEffect(() => {
    captureUtmParamsFromUrl();
  }, []);

  return null;
}
