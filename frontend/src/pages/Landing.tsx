import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CookieConsent from "../components/CookieConsent";

const rooms = [
  {
    id: 1,
    name: "Kamar Tipe A",
    price: "Rp 800.000 / bulan",
    size: "3x4 m",
    facilities: ["AC", "Kasur", "Lemari", "WiFi"],
    status: "Tersedia",
  },
  {
    id: 2,
    name: "Kamar Tipe B",
    price: "Rp 1.000.000 / bulan",
    size: "4x4 m",
    facilities: ["AC", "Kasur", "Lemari", "WiFi", "Kamar Mandi Dalam"],
    status: "Tersedia",
  },
  {
    id: 3,
    name: "Kamar Tipe C",
    price: "Rp 1.500.000 / bulan",
    size: "4x5 m",
    facilities: [
      "AC",
      "Kasur",
      "Lemari",
      "WiFi",
      "Kamar Mandi Dalam",
      "Kulkas",
    ],
    status: "Terisi",
  },
];

const Landing = () => {
  const [roomViewed, setRoomViewed] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track when user leaves page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const consent = localStorage.getItem("cookie_consent");
      if (consent === "accepted") {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        navigator.sendBeacon(
          "/api/track-visitor",
          new Blob(
            [
              JSON.stringify({
                page: window.location.pathname,
                time_spent: elapsed,
                room_viewed: roomViewed,
              }),
            ],
            { type: "application/json" },
          ),
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [roomViewed]);

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 shadow-sm sticky top-0 bg-white z-40">
        <h1 className="text-xl font-bold text-blue-600">Kost Bahagia</h1>
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Login Penghuni
        </Link>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-8 py-24 bg-blue-50">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Hunian Nyaman di Tengah Kota
        </h2>
        <p className="text-gray-500 max-w-xl mb-2">
          Jl. Contoh No. 123, Surabaya, Jawa Timur
        </p>
        <p className="text-gray-500 max-w-xl mb-8">
          Kost putra/putri dengan fasilitas lengkap, lingkungan aman dan nyaman,
          cocok untuk mahasiswa dan karyawan.
        </p>
        <a
          href="#kamar"
          className="px-6 py-3 bg-blue-600 text-white rounded
        hover:bg-blue-700"
        >
          Lihat Kamar
        </a>
      </section>

      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Fasilitas Umum
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {["WiFi Gratis", "Parkir Motor", "Dapur Bersama", "Laundry"].map(
            (item) => (
              <div key={item} className="bg-blue-50 p-4 rounded">
                <p className="text-sm font-medium text-gray-700">{item}</p>
              </div>
            ),
          )}
        </div>
      </section>

      <section id="kamar" className="px-8 py-16 bg-gray-50">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Daftar Kamar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setRoomViewed(room.name)}
            >
              <div className="bg-gray-200 h-40 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Foto Kamar</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-700">{room.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      room.status === "Tersedia"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
                <p className="text-blue-600 font-semibold mb-1">{room.price}</p>
                <p className="text-xs text-gray-400 mb-3">
                  Ukuran: {room.size}
                </p>
                <div className="flex flex-wrap gap-1">
                  {room.facilities.map((f) => (
                    <span
                      key={f}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Lokasi</h3>
        <p className="text-gray-500 mb-2">
          Jl. Contoh No. 123, Surabaya, Jawa Timur
        </p>
        <p className="text-gray-500">
          Dekat dengan kampus, pusat perbelanjaan, dan transportasi umum.
        </p>
      </section>

      <section className="px-8 py-16 bg-blue-50 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Hubungi Kami</h3>
        <p className="text-gray-500 mb-1">📞 08123456789</p>
        <p className="text-gray-500 mb-1">📧 kostbahagia@email.com</p>
        <p className="text-gray-500">💬 WhatsApp: 08123456789</p>
      </section>

      <footer className="text-center py-6 text-sm text-gray-400 border-t">
        © 2026 Kost Bahagia. All rights reserved.
      </footer>

      <CookieConsent timeSpent={timeSpent} roomViewed={roomViewed} />
    </div>
  );
};

export default Landing;
