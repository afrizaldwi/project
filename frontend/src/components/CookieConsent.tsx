import { useEffect, useState } from "react";

interface CookieConsentProps {
  onAccept?: () => void;
}

export type CookieConsentValue = "accepted" | "rejected";

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

const isCookieConsentValue = (value: string | null): value is CookieConsentValue =>
  value === "accepted" || value === "rejected";

const getBrowserCookieConsent = (): CookieConsentValue | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`));

  if (!cookie) {
    return null;
  }

  const value = decodeURIComponent(cookie.split("=")[1] ?? "");

  return isCookieConsentValue(value) ? value : null;
};

export const saveCookieConsent = (consent: CookieConsentValue) => {
  document.cookie = `${COOKIE_CONSENT_KEY}=${consent}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
};

export const getCookieConsent = (): CookieConsentValue | null => getBrowserCookieConsent();

const CookieConsent = ({ onAccept }: CookieConsentProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();

    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    saveCookieConsent("accepted");
    setShow(false);
    onAccept?.();
  };

  const handleDecline = () => {
    saveCookieConsent("rejected");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-xl bg-white p-4 shadow-lg border">
      <h2 className="mb-2 text-base font-semibold text-gray-900">
        Persetujuan Cookies
      </h2>

      <p className="mb-4 text-sm text-gray-700">
        Kami menggunakan cookies untuk menyimpan pilihan persetujuan Anda dan
        membantu menghitung statistik kunjungan halaman. Data kunjungan
        disimpan secara anonim, tanpa menyimpan informasi
        browser secara langsung. Apakah Anda menyetujui penggunaan cookies
        untuk statistik kunjungan?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleDecline}
          className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Tolak
        </button>

        <button
          onClick={handleAccept}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Terima
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
