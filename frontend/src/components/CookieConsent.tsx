import { useState, useEffect } from "react";
import api from "../api/axios";

interface CookieConsentProps {
  timeSpent: number;
  roomViewed: string | null;
}
const CookieConsent = ({ timeSpent, roomViewed }: CookieConsentProps) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = async () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
      <p className="text-sm text-center sm:text-left">
        Kami menggunakan cookies untuk melacak kunjungan Anda. Apakah Anda
        menyetujui penggunaan cookies?
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDecline}
          className="px-4 py-2 text-sm rounded bg-gray-600 hover:bg-gray-500"
        >
          Tolak
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700"
        >
          Terima
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
