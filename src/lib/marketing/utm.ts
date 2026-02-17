export type UTMParams = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

type StoredUtm = {
  params: UTMParams;
  expiresAt: number;
};

const STORAGE_KEY = "cf_utm_params_v1";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const utmKeyMap: Record<string, keyof UTMParams> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
};

const hasValue = (value?: string | null) => Boolean(value && value.trim().length > 0);

const parseUtmFromSearch = (searchParams: URLSearchParams): UTMParams | null => {
  const params: UTMParams = {};
  Object.entries(utmKeyMap).forEach(([queryKey, field]) => {
    const value = searchParams.get(queryKey);
    if (hasValue(value)) {
      params[field] = value!.trim();
    }
  });

  return Object.keys(params).length > 0 ? params : null;
};

const readStoredUtm = (): StoredUtm | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredUtm;
    if (!parsed?.expiresAt || typeof parsed.expiresAt !== "number" || !parsed.params) {
      return null;
    }

    if (parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const storeUtm = (params: UTMParams) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload: StoredUtm = {
      params,
      expiresAt: Date.now() + TTL_MS,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
};

export const captureUtmParamsFromUrl = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const fromUrl = parseUtmFromSearch(new URLSearchParams(window.location.search));
  if (fromUrl) {
    storeUtm(fromUrl);
    return fromUrl;
  }

  return readStoredUtm()?.params ?? null;
};

export const getUtmParamsForSubmission = (): UTMParams | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const fromUrl = parseUtmFromSearch(new URLSearchParams(window.location.search));
  const stored = readStoredUtm()?.params ?? {};
  const merged: UTMParams = {
    ...stored,
    ...(fromUrl ?? {}),
  };

  if (Object.values(merged).some((value) => hasValue(value))) {
    if (fromUrl) {
      storeUtm(merged);
    }
    return merged;
  }

  return undefined;
};
