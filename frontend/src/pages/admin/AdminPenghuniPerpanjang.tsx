import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sewaExtensionService from "../../services/sewaExtensionService";
import type { SewaExtensionDetail } from "../../types";

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value || 0);

const parseDate = (value?: string | null): Date | null => {
    if (!value || value === "-") return null;

    const dateOnly = value.slice(0, 10);
    const [yearRaw, monthRaw, dayRaw] = dateOnly.split("-");

    const year = Number(yearRaw);
    const month = Number(monthRaw);
    const day = Number(dayRaw);

    if (!year || !month || !day) return null;

    const date = new Date(year, month - 1, day);

    if (Number.isNaN(date.getTime())) return null;

    return date;
};

const toDateInputValue = (value?: string | null): string => {
    const date = parseDate(value);

    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatTanggal = (value?: string | null) => {
    const date = parseDate(value);

    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
};

const addMonths = (dateString?: string | null, months = 0): string | null => {
    const date = parseDate(dateString);

    if (!date) return null;

    const originalDay = date.getDate();

    date.setMonth(date.getMonth() + months);

    if (date.getDate() !== originalDay) {
        date.setDate(0);
    }

    return toDateInputValue(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")}`
    );
};

const AdminPenghuniPerpanjang = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [sewa, setSewa] = useState<SewaExtensionDetail | null>(null);
    const [durasi, setDurasi] = useState<number>(1);
    const [tanggalMulai, setTanggalMulai] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hargaBulanan = Number(sewa?.harga_bulanan ?? 0);

    const totalTagihan = useMemo(() => {
        return hargaBulanan * durasi;
    }, [hargaBulanan, durasi]);

    const estimasiTanggalKeluar = useMemo(() => {
        if (!tanggalMulai || durasi < 1) return null;

        return addMonths(tanggalMulai, durasi);
    }, [tanggalMulai, durasi]);

    useEffect(() => {
        const sewaId = Number(id);

        if (!sewaId) {
            setError("ID sewa tidak valid.");
            setIsLoading(false);
            return;
        }

        sewaExtensionService
            .getById(sewaId)
            .then((data) => {
                setSewa(data);
                setTanggalMulai(toDateInputValue(data.tanggal_keluar));
            })
            .catch(() => {
                setError("Data sewa tidak ditemukan.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    const handleSubmit = async () => {
        const sewaId = Number(id);

        if (!sewa || !sewaId) return;

        if (!tanggalMulai) {
            setError("Tanggal mulai perpanjangan tidak valid.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await sewaExtensionService.perpanjang(sewaId, {
                tanggal_mulai: tanggalMulai,
                durasi_sewa_bulan: durasi,
                harga_deal: totalTagihan,
            });

            alert("Sewa berhasil diperpanjang dan tagihan baru berhasil dibuat.");
            navigate("/admin/penghuni");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Gagal memperpanjang sewa.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="p-6">
                <p className="text-sm text-gray-500">Memuat data sewa...</p>
            </main>
        );
    }

    if (error && !sewa) {
        return (
            <main className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/penghuni")}
                    className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                    Kembali
                </button>
            </main>
        );
    }

    return (
        <main className="space-y-6 p-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/admin/penghuni")}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                >
                    Data Penghuni / Perpanjang Sewa
                </button>

                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                    Perpanjang Sewa
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Perpanjangan sewa untuk {sewa?.nama ?? "-"} di kamar{" "}
                    {sewa?.nomor_kamar ?? "-"}.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard label="Nama Penghuni" value={sewa?.nama ?? "-"} />
                <InfoCard label="Nomor Kamar" value={sewa?.nomor_kamar ?? "-"} />
                <InfoCard label="Tanggal Masuk" value={formatTanggal(sewa?.tanggal_masuk)} />
                <InfoCard
                    label="Tanggal Keluar Saat Ini"
                    value={formatTanggal(sewa?.tanggal_keluar)}
                />
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Detail Perpanjangan</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Tanggal mulai dikunci sesuai tanggal keluar saat ini agar riwayat sewa
                    tidak tumpang tindih.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Tanggal Mulai Perpanjangan
                        </label>
                        <input
                            type="date"
                            value={tanggalMulai}
                            readOnly
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Durasi Perpanjangan
                        </label>
                        <select
                            value={durasi}
                            onChange={(event) => setDurasi(Number(event.target.value))}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            {Array.from({ length: 24 }, (_, index) => index + 1).map((month) => (
                                <option key={month} value={month}>
                                    {month} bulan
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Harga Bulanan
                        </label>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900">
                            {formatRupiah(hargaBulanan)}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Estimasi Tanggal Keluar Baru
                        </label>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900">
                            {formatTanggal(estimasiTanggalKeluar)}
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-xl bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-blue-700">
                        Total Tagihan Perpanjangan
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-900">
                        {formatRupiah(totalTagihan)}
                    </p>
                    <p className="mt-1 text-xs text-blue-700">
                        {formatRupiah(hargaBulanan)} × {durasi} bulan
                    </p>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/penghuni")}
                        className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !tanggalMulai}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Menyimpan..." : "Simpan Perpanjangan"}
                    </button>
                </div>
            </section>
        </main>
    );
};

interface InfoCardProps {
    label: string;
    value: string;
}

const InfoCard = ({ label, value }: InfoCardProps) => (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-2 text-lg font-bold text-gray-900">{value}</p>
    </div>
);

export default AdminPenghuniPerpanjang;