import { Link } from "react-router-dom";
import api from "../api/axios";
import { useState, useEffect, useRef, useCallback } from "react";
import CookieConsent, { getCookieConsent } from "../components/CookieConsent";
import type { KamarStatus } from "../types";

type LandingKamar = {
    id_kamar: number;
    nomor_kamar: string;
    harga_bulanan: number | string;
    status_kamar: KamarStatus;
    foto_url?: string | null;
};

const facilities = [
    "WiFi Gratis",
    "Parkir Motor",
    "Dapur Bersama",
    "Laundry",
    "CCTV 24 Jam",
    "Air Panas",
    "Musholla",
    "Kebersihan Rutin",
];

const Landing = () => {
    const hasSentTrackingRef = useRef(false);

    const [isScrolled, setIsScrolled] = useState(false);

    const [rooms, setRooms] = useState<LandingKamar[]>([]);

    useEffect(() => {
        api.get<LandingKamar[]>("/public/kamar")
            .then((response) => {
                setRooms(response.data);
            })
            .catch(() => {
                setRooms([]);
            })
    }, []);

    const formatRupiah = (value: number | string) => {
        const numberValue = Number(value);

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numberValue);
    };

    const sendTracking = useCallback(() => {
        const consent = getCookieConsent();

        if (consent !== "accepted" || hasSentTrackingRef.current) {
            return;
        }

        hasSentTrackingRef.current = true;

        const payload = JSON.stringify({ analytics_consent: true });

        const blob = new Blob([payload], {
            type: "application/json",
        });

        const sent = navigator.sendBeacon("/api/track-visitor", blob);

        if (!sent) {
            fetch("/api/track-visitor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: payload,
                keepalive: true,
            }).catch(() => {
                hasSentTrackingRef.current = false;
            });
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (getCookieConsent() === "accepted") {
            sendTracking();
        }

        const handlePageHide = () => {
            sendTracking();
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                sendTracking();
            }
        };

        window.addEventListener("pagehide", handlePageHide);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("pagehide", handlePageHide);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [sendTracking]);

    return (
        <div className="min-h-screen bg-white text-dark">
            <nav
                className={`fixed top-0 left-0 right-0 z-40 transition-shadow ${isScrolled ? "shadow-md bg-white" : "bg-white"
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary">Kost Bahagia</h1>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-dark">
                        <a href="#fasilitas" className="hover:text-primary transition-colors">
                            Fasilitas
                        </a>
                        <a href="#kamar" className="hover:text-primary transition-colors">
                            Kamar
                        </a>
                        <a href="#tentang" className="hover:text-primary transition-colors">
                            Tentang
                        </a>
                        <a href="#lokasi" className="hover:text-primary transition-colors">
                            Lokasi
                        </a>
                        <a href="#kontak" className="hover:text-primary transition-colors">
                            Kontak
                        </a>
                    </div>
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-accent transition-colors"
                    >
                        Login Penghuni
                    </Link>
                </div>
            </nav>

            <section className="pt-24 pb-20 px-6 bg-secondary">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-4xl lg:text-5xl font-bold text-dark mb-4 leading-tight">
                            Hunian Nyaman <br />
                            <span className="text-primary">di Tengah Kota</span>
                        </h2>
                        <p className="text-gray-500 mb-2">📍 Jl. No. 123, Surabaya, Jawa Timur</p>
                        <p className="text-gray-500 max-w-lg mb-8">
                            Kost putra/putri dengan fasilitas lengkap, lingkungan aman dan nyaman, cocok untuk mahasiswa dan karyawan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <a
                                href="#kamar"
                                className="px-6 py-3 bg-primary text-white rounded font-medium hover:bg-accent transition-colors text-center"
                            >
                                Lihat Kamar
                            </a>

                            <a
                                href="#kontak"
                                className="px-6 py-3 border border-primary text-primary rounded font-medium hover:bg-secondary transition-colors text-center"
                            >
                                Hubungi Kami
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="bg-gray-200 rounded-xl h-72 flex items-center justify-center">
                            <img src="https://jayaintero.id/wp-content/uploads/2024/07/Tampak-depan-leter-l-8x12-1.jpg" alt="foto kost" className="w-full h-full rounded" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="fasilitas" className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-2xl font-bold text-center text-dark mb-2">
                        Fasilitas Umum
                    </h3>
                    <p className="text-center text-gray-500 mb-10">
                        Semua yang Anda butuhkan sudah tersedia
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {facilities.map((item) => (
                            <div
                                key={item}
                                className="bg-secondary p-4 rounded-lg text-center border border-blue-100"
                            >
                                <p className="text-sm font-medium text-dark">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="kamar" className="py-16 px-6 bg-light">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-2xl font-bold text-center text-dark mb-2">
                        Daftar Kamar
                    </h3>
                    <p className="text-center text-gray-500 mb-10">
                        Pilih kamar yang sesuai dengan kebutuhan Anda
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <div
                                key={room.id_kamar}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                            >
                                <div className="relative bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                                    <span className="text-gray-400 text-sm font-medium">
                                        Foto kamar belum tersedia
                                    </span>
                                    {room.foto_url && (
                                        <img
                                            className="absolute inset-0 h-full w-full object-cover"
                                            src={room.foto_url}
                                            alt={`Kamar ${room.nomor_kamar}`}
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-dark">{room.nomor_kamar}</h4>
                                    </div>
                                    <p className="text-primary font-bold text-lg mb-1">
                                        {formatRupiah(room.harga_bulanan)}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {facilities.map((f) => (
                                            <span
                                                key={f}
                                                className="text-xs bg-secondary text-primary px-2 py-1 rounded-full"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="tentang" className="py-16 px-6">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                    <div className="flex-1">
                        <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                            <img src="https://media.karousell.com/media/photos/products/2023/10/26/koskosan_di_cirendeu_depan_bal_1698301544_bc98d3cf_progressive.jpg" alt="" className="h-full w-full" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-dark mb-4">
                            Tentang Kost Bahagia
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Kost Bahagia adalah hunian nyaman yang berlokasi strategis di pusat kota
                            Surabaya. Berdiri sejak 2010, kami telah melayani ratusan penghuni dengan
                            pelayanan terbaik.
                        </p>
                        <p className="text-gray-500">
                            Kami berkomitmen untuk memberikan kenyamanan dan keamanan bagi setiap
                            penghuni dengan fasilitas lengkap dan pengelolaan yang profesional.
                        </p>
                    </div>
                </div>
            </section>

            <section id="lokasi" className="py-16 px-6 bg-light">
                <div className="max-w-6xl mx-auto">
                    <p className="text-center text-gray-500 mb-10">
                        Strategis dan mudah dijangkau
                    </p>
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-1 w-full">
                            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11192.32100396721!2d112.78516836629777!3d-7.344571974979252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fba48250fc25%3A0xe030cbbc9482d4fd!2sUniversitas%20Islam%20Negeri%20Sunan%20Ampel%20Kampus%202!5e0!3m2!1sid!2sid!4v1779324784778!5m2!1sid!2sid"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    width={"100%"}
                                    height={"100%"}
                                ></iframe>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-dark mb-3">Kost Bahagia</h4>
                            <p className="text-gray-500 mb-2">
                                📍 Jl. Contoh No. 123, Surabaya, Jawa Timur 60123
                            </p>
                            <p className="text-gray-500 mb-4">Dekat dengan:</p>
                            <ul className="text-gray-500 space-y-1 text-sm">
                                <li>🏫 Universitas Contoh (500m)</li>
                                <li>🏥 RS Contoh (1km)</li>
                                <li>🛒 Mall Contoh (800m)</li>
                                <li>🚌 Halte Bus (200m)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="kontak" className="py-16 px-6 bg-primary text-white">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Tertarik untuk Tinggal?</h3>
                        <p className="text-blue-100 mb-4">
                            Hubungi kami sekarang untuk informasi lebih lanjut dan jadwalkan kunjungan.
                        </p>
                        <div className="space-y-2 text-blue-100 text-sm">
                            <p>📞 08123456789</p>
                            <p>📧 kostbahagia@email.com</p>
                            <p>💬 WhatsApp: 08123456789</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-3 bg-white text-primary rounded font-medium hover:bg-secondary transition-colors text-center"
                        >
                            Chat WhatsApp
                        </a>
                        <Link
                            to="/login"
                            className="px-6 py-3 border border-white text-white rounded font-medium hover:bg-accent transition-colors text-center"
                        >
                            Login Penghuni
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-8 px-6 bg-accent text-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold mb-1">Kost Bahagia</h1>
                        <p className="text-blue-200 text-sm">
                            Jl. Contoh No. 123, Surabaya, Jawa Timur
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm text-blue-200">
                        <a href="#fasilitas" className="hover:text-white">
                            Fasilitas
                        </a>
                        <a href="#kamar" className="hover:text-white">
                            Kamar
                        </a>
                        <a href="#tentang" className="hover:text-white">
                            Tentang
                        </a>
                        <a href="#lokasi" className="hover:text-white">
                            Lokasi
                        </a>
                        <a href="#kontak" className="hover:text-white">
                            Kontak
                        </a>
                    </div>
                    <p className="text-blue-200 text-sm">© 2026 Kost Bahagia</p>
                </div>
            </footer>

            <CookieConsent onAccept={sendTracking} />
        </div>
    );
};

export default Landing;