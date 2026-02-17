export type MarketingEvent =
  | "marketing_cta_click"
  | "lead_submit_success"
  | "lead_submit_rate_limited";

type MarketingEventPayload = Record<string, unknown>;

const isAnalyticsEnabled = () => process.env.NEXT_PUBLIC_ANALYTICS === "true";

export const trackMarketingEvent = (event: MarketingEvent, payload?: MarketingEventPayload) => {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }

  const detail = {
    event,
    ...(payload ?? {}),
  };

  window.dispatchEvent(new CustomEvent("marketing:track", { detail }));

  if (process.env.NODE_ENV !== "production") {
    console.info("[marketing]", detail);
  }
};
