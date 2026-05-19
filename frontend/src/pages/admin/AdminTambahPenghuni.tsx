import {
    type ChangeEvent,
    type FormEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import adminApi from "../../api/admin";
import type { KamarTersedia } from "../../types";

const makeSlug = (value: string) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, ".");
};

const generateCredentialFromName = (name: string, suffix: string) => {
    const slug = makeSlug(name);

    if (!slug) {
        return {
            email: "",
            password: "",
        };
    }

    return {
        email: `${slug}@kost.com`,
        password: `Kost@${suffix}`,
    };
};

const formatRupiah = (value: string | number) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(number);
};

const getRoomType = (roomNumber: string) => {
    const firstCharacter = roomNumber.trim().charAt(0).toUpperCase();
    return firstCharacter || "LAINNYA";
};

const AdminTambahPenghuni = () => {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState<KamarTersedia[]>([]);
    const [selectedType, setSelectedType] = useState("");
    const [isLoadingRooms, setIsLoadingRooms] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [form, setForm] = useState({
        nama_lengkap: "",
        email: "",
        password: "",
        no_hp: "",
        alamat_asal: "",
        id_kamar: "",
        tanggal_masuk: new Date().toISOString().slice(0, 10),
        durasi_sewa_bulan: "1",
    });

    const credentialSuffixRef = useRef(
        Math.floor(100000 + Math.random() * 900000).toString()
    );

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setIsLoadingRooms(true);
                setErrorMessage("");

                const data = await adminApi.getKamarTersedia();
                setRooms(data);
            } catch {
                setErrorMessage("Gagal memuat kamar tersedia.");
            } finally {
                setIsLoadingRooms(false);
            }
        };

        fetchRooms();
    }, []);

    const roomTypes = useMemo(() => {
        const groupedRooms = new Map<string, KamarTersedia[]>();

        rooms.forEach((room) => {
            const type = getRoomType(room.nomor_kamar);
            const currentRooms = groupedRooms.get(type) || [];
            groupedRooms.set(type, [...currentRooms, room]);
        });

        return Array.from(groupedRooms.entries())
            .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
            .map(([type, roomGroup]) => {
                const prices = roomGroup.map((room) => Number(room.harga_bulanan || 0));
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);

                return {
                    id: type,
                    name: `Tipe ${type}`,
                    rooms: roomGroup,
                    priceLabel:
                        minPrice === maxPrice
                            ? formatRupiah(minPrice)
                            : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`,
                    description: roomGroup[0]?.fasilitas || `${roomGroup.length} kamar tersedia`,
                };
            });
    }, [rooms]);

    const selectedRoom = rooms.find((room) => String(room.id_kamar) === form.id_kamar);

    const selectedTypeRooms = useMemo(() => {
        if (!selectedType) return [];

        return rooms.filter((room) => getRoomType(room.nomor_kamar) === selectedType);
    }, [rooms, selectedType]);

    const totalTagihan = selectedRoom
        ? Number(selectedRoom.harga_bulanan || 0) * Number(form.durasi_sewa_bulan || 0)
        : 0;

    const estimasiCheckOut = useMemo(() => {
        if (!form.tanggal_masuk || !form.durasi_sewa_bulan) return "-";

        const date = new Date(form.tanggal_masuk);
        date.setMonth(date.getMonth() + Number(form.durasi_sewa_bulan));

        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }, [form.tanggal_masuk, form.durasi_sewa_bulan]);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        if (name === "nama_lengkap") {
            const generatedCredential = generateCredentialFromName(
                value,
                credentialSuffixRef.current
            );

            setForm((previous) => ({
                ...previous,
                nama_lengkap: value,
                email: generatedCredential.email,
                password: generatedCredential.password,
            }));

            return;
        }

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setForm((previous) => ({
            ...previous,
            id_kamar: "",
        }));
    };

    const handleRoomSelect = (roomId: number) => {
        setForm((previous) => ({
            ...previous,
            id_kamar: String(roomId),
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setErrorMessage("");

        if (!form.id_kamar) {
            setErrorMessage("Pilih kamar terlebih dahulu.");
            return;
        }

        try {
            setIsSubmitting(true);

            await adminApi.createPenghuni({
                nama_lengkap: form.nama_lengkap,
                email: form.email,
                password: form.password,
                no_hp: form.no_hp,
                alamat_asal: form.alamat_asal || undefined,
                id_kamar: Number(form.id_kamar),
                tanggal_masuk: form.tanggal_masuk,
                durasi_sewa_bulan: Number(form.durasi_sewa_bulan),
            });

            navigate("/admin/penghuni");
        } catch (error: any) {
            const validationErrors = error?.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0] as string[];
                setErrorMessage(firstError?.[0] || "Validasi gagal.");
            } else {
                setErrorMessage(error?.response?.data?.message || "Gagal menambahkan penghuni.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-light p-4 md:p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <h1 className="text-2xl font-black text-dark">Tambah Penghuni Baru</h1>
                    <p className="mt-1 text-sm font-medium text-dark/50">
                        Membuat akun penyewa sekaligus mencatat sewa kamar.
                    </p>
                </div>

                {errorMessage && (
                    <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-black text-dark">Data Penghuni</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-dark/70">
                                    Nama Lengkap *
                                </label>
                                <input
                                    name="nama_lengkap"
                                    value={form.nama_lengkap}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold text-dark/70">
                                    No. HP *
                                </label>
                                <input
                                    name="no_hp"
                                    type="number"
                                    value={form.no_hp}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold text-dark/70">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-light p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="mt-1 text-xs font-medium text-dark/40">
                                    Email dibuat otomatis dari nama, tapi masih bisa diedit.
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold text-dark/70">
                                    Password *
                                </label>
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    disabled
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-light p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="mt-1 text-xs font-medium text-dark/40">
                                    Berikan password ini kepada penghuni.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="mb-1 block text-sm font-bold text-dark/70">
                                Alamat Asal
                            </label>
                            <textarea
                                name="alamat_asal"
                                value={form.alamat_asal}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </section>

                    {/* DATA SEWA */}
                    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-black text-dark">Data Sewa</h2>

                        <div className="mb-6">
                            <p className="mb-3 text-sm font-black text-dark">Pilih Tipe Kamar</p>

                            {isLoadingRooms ? (
                                <div className="rounded-xl bg-light p-4 text-sm font-semibold text-dark/50">
                                    Memuat kamar tersedia...
                                </div>
                            ) : roomTypes.length === 0 ? (
                                <div className="rounded-xl bg-light p-4 text-sm font-semibold text-dark/50">
                                    Tidak ada kamar tersedia.
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-3">
                                    {roomTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => handleTypeSelect(type.id)}
                                            className={`rounded-2xl border-2 p-4 text-left transition-all ${selectedType === type.id
                                                ? "border-primary bg-secondary shadow-sm"
                                                : "border-gray-100 hover:border-primary/30"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="font-black text-dark">{type.name}</p>
                                                <span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-black uppercase text-success">
                                                    Tersedia
                                                </span>
                                            </div>

                                            <p className="mt-3 text-sm font-black text-primary">
                                                {type.priceLabel} / bln
                                            </p>
                                            <p className="mt-1 line-clamp-2 text-xs font-medium text-dark/50">
                                                {type.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <p className="mb-3 text-sm font-black text-dark">Pilih Kamar *</p>

                            {selectedType ? (
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8">
                                    {selectedTypeRooms.map((room) => (
                                        <button
                                            key={room.id_kamar}
                                            type="button"
                                            onClick={() => handleRoomSelect(room.id_kamar)}
                                            className={`rounded-xl border-2 p-3 text-xs font-black transition-all ${form.id_kamar === String(room.id_kamar)
                                                ? "border-primary bg-primary text-white"
                                                : "border-gray-100 text-dark/40 hover:border-primary/30 hover:text-primary"
                                                }`}
                                        >
                                            {room.nomor_kamar}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl bg-light p-4 text-sm font-semibold text-dark/40">
                                    Pilih tipe kamar terlebih dahulu
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-dark/70">
                                    Tanggal Masuk *
                                </label>
                                <input
                                    name="tanggal_masuk"
                                    type="date"
                                    value={form.tanggal_masuk}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold text-dark/70">
                                    Durasi (Bulan) *
                                </label>
                                <input
                                    name="durasi_sewa_bulan"
                                    type="number"
                                    min={1}
                                    value={form.durasi_sewa_bulan}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-secondary p-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-bold text-primary">Total Tagihan Awal</p>
                                    <p className="mt-1 text-2xl font-black text-dark">
                                        {formatRupiah(totalTagihan)}
                                    </p>
                                </div>

                                <div className="text-left md:text-right">
                                    <p className="text-sm font-bold text-primary">Estimasi Check-Out:</p>
                                    <p className="mt-1 text-lg font-black text-dark">{estimasiCheckOut}</p>
                                </div>
                            </div>

                            {selectedRoom && (
                                <div className="mt-4 rounded-xl bg-white p-4 text-sm font-medium text-dark/70">
                                    <p className="font-black text-dark">Detail kamar terpilih</p>
                                    <p>Nomor: {selectedRoom.nomor_kamar}</p>
                                    <p>Luas: {selectedRoom.luas_kamar}</p>
                                    <p>Fasilitas: {selectedRoom.fasilitas}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="flex justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/penghuni")}
                            className="px-8 py-2.5 text-sm font-black text-dark/40 transition-colors hover:text-dark"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-primary px-8 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Penghuni"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminTambahPenghuni;