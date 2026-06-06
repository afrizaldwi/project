import { useEffect, useState } from "react";

interface CookieConsentProps {
  onConsentSaved?: (consent: CookieConsentSettings) => void;
}

export interface CookieConsentSettings {
  analytics_consent: boolean;
  location_consent: boolean;
  browser_consent: boolean;
}

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

const normalizeConsent = (consent: CookieConsentSettings): CookieConsentSettings => {
  const analyticsConsent = Boolean(consent.analytics_consent);
  const locationConsent = analyticsConsent && Boolean(consent.location_consent);
  const browserConsent = analyticsConsent && Boolean(consent.browser_consent);

  return {
    analytics_consent: analyticsConsent,
    location_consent: locationConsent,
    browser_consent: browserConsent,
  };
};

const isConsentSettings = (value: unknown): value is CookieConsentSettings => {
  if (!value || typeof value !== "object") return false;

  const consent = value as Partial<CookieConsentSettings>;

  return typeof consent.analytics_consent === "boolean";
};

const getBrowserCookieConsent = (): CookieConsentSettings | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`));

  if (!cookie) {
    return null;
  }

  const value = decodeURIComponent(cookie.slice(COOKIE_CONSENT_KEY.length + 1));

  if (value === "accepted") {
    return {
      analytics_consent: true,
      location_consent: false,
      browser_consent: true,
    };
  }

  if (value === "rejected") {
    return {
      analytics_consent: false,
      location_consent: false,
      browser_consent: false,
    };
  }

  try {
    const parsed = JSON.parse(value);

    return isConsentSettings(parsed) ? normalizeConsent(parsed) : null;
  } catch {
    return null;
  }
};

export const saveCookieConsent = (consent: CookieConsentSettings) => {
  const normalizedConsent = normalizeConsent(consent);
  const value = encodeURIComponent(JSON.stringify(normalizedConsent));

  document.cookie = `${COOKIE_CONSENT_KEY}=${value}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;

  return normalizedConsent;
};

export const getCookieConsent = (): CookieConsentSettings | null => getBrowserCookieConsent();

const CookieConsent = ({ onConsentSaved }: CookieConsentProps) => {
  const [show, setShow] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [locationConsent, setLocationConsent] = useState(false);
  const [browserConsent, setBrowserConsent] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();

    if (!consent) {
      setShow(true);
    }
  }, []);

  const persistConsent = (consent: CookieConsentSettings) => {
    const savedConsent = saveCookieConsent(consent);

    setShow(false);
    onConsentSaved?.(savedConsent);
  };

  const handleSave = () => {
    persistConsent({
      analytics_consent: analyticsConsent,
      location_consent: locationConsent,
      browser_consent: browserConsent,
    });
  };

  const handleDeclineAll = () => {
    persistConsent({
      analytics_consent: false,
      location_consent: false,
      browser_consent: false,
    });
  };

  const handleAcceptAll = () => {
    setAnalyticsConsent(true);
    setLocationConsent(true);
    setBrowserConsent(true);
    persistConsent({
      analytics_consent: true,
      location_consent: true,
      browser_consent: true,
    });
  };

  const handleAnalyticsChange = (checked: boolean) => {
    setAnalyticsConsent(checked);

    if (!checked) {
      setLocationConsent(false);
      setBrowserConsent(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-xl border bg-white p-4 shadow-lg">
      <h2 className="mb-2 text-base font-semibold text-gray-900">
        Pengaturan Cookie
      </h2>

      <p className="mb-4 text-sm text-gray-700">
        {isCustomizing
          ? "Analitik digunakan untuk menghitung jumlah kunjungan. Lokasi hanya digunakan untuk menyimpan kota dan negara jika diizinkan. Informasi browser hanya menyimpan nama browser secara umum. Sistem tidak menyimpan IP address asli, user agent lengkap, atau koordinat lokasi."
          : "Kami menggunakan cookie untuk menjalankan fitur penting aplikasi dan, jika Anda izinkan, menghitung kunjungan landing page. Anda dapat menerima semua cookie, menolak cookie non-esensial, atau mengatur data yang boleh digunakan."}
      </p>

      {isCustomizing && (
        <div className="space-y-3">
          <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked
              disabled
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 disabled:opacity-60"
            />
            <span>
              <span className="block font-medium text-gray-900">Cookie Esensial</span>
              <span className="block text-gray-600">
                Selalu aktif untuk fitur dasar aplikasi, autentikasi, dan keamanan.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={analyticsConsent}
              onChange={(event) => handleAnalyticsChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span>
              <span className="block font-medium text-gray-900">Analitik Pengunjung</span>
              <span className="block text-gray-600">
                Menghitung kunjungan landing page tanpa menyimpan identitas pengguna.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={locationConsent}
              disabled={!analyticsConsent}
              onChange={(event) => setLocationConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 disabled:opacity-50"
            />
            <span className={!analyticsConsent ? "text-gray-400" : undefined}>
              <span className="block font-medium">Lokasi Kota/Negara</span>
              <span className="block">
                Mencoba mendeteksi kota dan negara secara otomatis jika analitik diizinkan.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={browserConsent}
              disabled={!analyticsConsent}
              onChange={(event) => setBrowserConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 disabled:opacity-50"
            />
            <span className={!analyticsConsent ? "text-gray-400" : undefined}>
              <span className="block font-medium">Informasi Browser</span>
              <span className="block">
                Menyimpan nama browser umum seperti Chrome, Edge, Firefox, atau Safari.
              </span>
            </span>
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-col justify-end gap-3 sm:flex-row">
        {isCustomizing && (
          <button
            onClick={() => setIsCustomizing(false)}
            className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Kembali
          </button>
        )}

        <button
          onClick={handleDeclineAll}
          className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Tolak Semua
        </button>

        <button
          onClick={handleAcceptAll}
          className="rounded-lg border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
        >
          Terima Semua
        </button>

        {isCustomizing ? (
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Simpan Pilihan
          </button>
        ) : (
          <button
            onClick={() => setIsCustomizing(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Atur Pilihan
          </button>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
