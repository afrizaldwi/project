export type BrowserName =
  | "Brave"
  | "Edge"
  | "Opera"
  | "Samsung Internet"
  | "Firefox"
  | "Safari"
  | "Chrome"
  | "Unknown";

type BrowserBrand = {
  brand: string;
  version?: string;
};

type NavigatorWithBrowserHints = Navigator & {
  brave?: {
    isBrave?: () => Promise<boolean>;
  };
  userAgentData?: {
    brands?: BrowserBrand[];
  };
};

const hasBrand = (brands: BrowserBrand[], pattern: RegExp) =>
  brands.some((brand) => pattern.test(brand.brand));

export const detectBrowserName = async (): Promise<BrowserName> => {
  const browserNavigator = navigator as NavigatorWithBrowserHints;

  try {
    if (browserNavigator.brave?.isBrave && await browserNavigator.brave.isBrave()) {
      return "Brave";
    }
  } catch {
  }

  const brands = browserNavigator.userAgentData?.brands ?? [];

  if (hasBrand(brands, /Microsoft Edge/i)) return "Edge";
  if (hasBrand(brands, /Opera|Opera GX/i)) return "Opera";
  if (hasBrand(brands, /Samsung Internet/i)) return "Samsung Internet";
  if (hasBrand(brands, /Firefox/i)) return "Firefox";
  if (hasBrand(brands, /Safari/i) && !hasBrand(brands, /Chrome|Chromium|Microsoft Edge|Opera|Samsung Internet/i)) {
    return "Safari";
  }
  if (hasBrand(brands, /Google Chrome|Chromium/i)) return "Chrome";

  const userAgent = navigator.userAgent;

  if (/Edg\//.test(userAgent)) return "Edge";
  if (/OPR\/|Opera/.test(userAgent)) return "Opera";
  if (/SamsungBrowser/.test(userAgent)) return "Samsung Internet";
  if (/Firefox\//.test(userAgent)) return "Firefox";
  if (/Safari\//.test(userAgent) && !/Chrome\/|Chromium\/|CriOS\/|Edg\/|OPR\/|SamsungBrowser/.test(userAgent)) {
    return "Safari";
  }
  if (/Chrome\/|CriOS\//.test(userAgent)) return "Chrome";

  return "Unknown";
};
