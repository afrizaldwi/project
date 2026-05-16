import { useEffect, useState } from "react";

interface CookieConsentProps {
  onAccept?: () => void;
}

const CookieConsent = ({ onAccept }: CookieConsentProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-xl bg-white p-4 shadow-lg border">
      <p className="mb-4 text-sm text-gray-700">
        Kami menggunakan cookies untuk melacak kunjungan Anda. Apakah Anda
        menyetujui penggunaan cookies?
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