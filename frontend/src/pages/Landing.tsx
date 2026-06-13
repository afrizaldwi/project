import api from "../api/axios";
import { useState, useEffect, useRef, useCallback } from "react";
import CookieConsent, { getCookieConsent } from "../components/CookieConsent";
import LandingAbout from "../components/landing/LandingAbout";
import LandingContact from "../components/landing/LandingContact";
import LandingFacilities from "../components/landing/LandingFacilities";
import LandingFooter from "../components/landing/LandingFooter";
import LandingHero from "../components/landing/LandingHero";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingRooms from "../components/landing/LandingRooms";
import LandingSteps from "../components/landing/LandingSteps";
import { detectBrowserName } from "../utils/browserDetection";
import type { LandingKamar } from "../types";

const facilities = [
    "WiFi Gratis",
    "Parkir Motor",
    "Dapur Bersama",
    "Laundry Kiloan",
    "CCTV 24 Jam",
    "Air Panas",
    "Musholla",
    "Kebersihan Rutin",
];

type VisitorCoordinates = {
    latitude: number;
    longitude: number;
};

const getVisitorCoordinates = (): Promise<VisitorCoordinates | null> => {
    if (!("geolocation" in navigator)) {
        return Promise.resolve(null);
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }),
            () => resolve(null),
            {
                enableHighAccuracy: false,
                maximumAge: 300000,
                timeout: 5000,
            },
        );
    });
};

const Landing = () => {
    const hasSentTrackingRef = useRef(false);

    const [isScrolled, setIsScrolled] = useState(false);

    const [rooms, setRooms] = useState<LandingKamar[]>([]);

    useEffect(() => {
        api.get<LandingKamar[]>("/public/kamar/types")
            .then((response) => {
                setRooms(response.data);
            })
            .catch(() => {
                setRooms([]);
            });
    }, []);

    console.log(rooms);


    const formatRupiah = (value: number | string) => {
        const numberValue = Number(value);

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numberValue);
    };

    const sendTracking = useCallback(async () => {
        const consent = getCookieConsent();

        if (!consent?.analytics_consent || hasSentTrackingRef.current) {
            return;
        }

        hasSentTrackingRef.current = true;

        try {
            const [browserName, coordinates] = await Promise.all([
                consent.browser_consent
                    ? detectBrowserName().catch(() => "Unknown" as const)
                    : Promise.resolve(null),
                consent.location_consent ? getVisitorCoordinates() : Promise.resolve(null),
            ]);

            const payload: {
                analytics_consent: true;
                location_consent: boolean;
                browser_consent: boolean;
                browser_name?: string;
                latitude?: number;
                longitude?: number;
            } = {
                analytics_consent: true,
                location_consent: consent.location_consent,
                browser_consent: consent.browser_consent,
            };

            if (browserName) {
                payload.browser_name = browserName;
            }

            if (coordinates) {
                payload.latitude = coordinates.latitude;
                payload.longitude = coordinates.longitude;
            }

            await api.post("/track-visitor", payload);
        } catch {
            hasSentTrackingRef.current = false;
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        void sendTracking();
    }, [sendTracking]);

    return (
        <div className="min-h-screen bg-white text-dark">
            <LandingNavbar isScrolled={isScrolled} />
            <LandingHero />
            <LandingFacilities facilities={facilities} />
            <LandingRooms
                rooms={rooms}
                facilities={facilities}
                formatRupiah={formatRupiah}
            />
            <LandingAbout />
            <LandingSteps />
            <LandingContact />
            <LandingFooter />

            <CookieConsent onConsentSaved={() => { void sendTracking(); }} />
        </div>
    );
};

export default Landing;
