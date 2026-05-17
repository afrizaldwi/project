import { type FormEvent, useEffect, useRef, useState } from "react";
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

const AdminTambahPenghuni = () => {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState<KamarTersedia[]>([]);
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

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    const selectedRoom = rooms.find((room) => String(room.id_kamar) === form.id_kamar);

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Tambah Penghuni</h1>
            </div>

            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Nama Lengkap
                        </label>
                        <input
                            name="nama_lengkap"
                            value={form.nama_lengkap}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            disabled
                            required
                            className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm text-gray-600 focus:outline-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Email dibuat otomatis dari nama penghuni.
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Password Akun
                        </label>
                        <input
                            name="password"
                            type="text"
                            value={form.password}
                            disabled
                            required
                            minLength={8}
                            className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm text-gray-600 focus:outline-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Password dibuat otomatis. Berikan password ini kepada penghuni.
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            No. HP
                        </label>
                        <input
                            type="number"
                            name="no_hp"
                            value={form.no_hp}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Alamat Asal
                    </label>
                    <textarea
                        name="alamat_asal"
                        value={form.alamat_asal}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Kamar
                        </label>
                        <select
                            name="id_kamar"
                            value={form.id_kamar}
                            onChange={handleChange}
                            required
                            disabled={isLoadingRooms}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">
                                {isLoadingRooms ? "Memuat kamar..." : "Pilih kamar"}
                            </option>

                            {rooms.map((room) => (
                                <option key={room.id_kamar} value={room.id_kamar}>
                                    {room.nomor_kamar} - Rp {Number(room.harga_bulanan).toLocaleString("id-ID")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Tanggal Masuk
                        </label>
                        <input
                            name="tanggal_masuk"
                            type="date"
                            value={form.tanggal_masuk}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Durasi Sewa
                        </label>
                        <input
                            name="durasi_sewa_bulan"
                            type="number"
                            min={1}
                            value={form.durasi_sewa_bulan}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {selectedRoom && (
                    <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                        <p className="font-medium">Detail kamar terpilih</p>
                        <p>Nomor: {selectedRoom.nomor_kamar}</p>
                        <p>Luas: {selectedRoom.luas_kamar}</p>
                        <p>Fasilitas: {selectedRoom.fasilitas}</p>
                        <p>
                            Harga bulanan: Rp {Number(selectedRoom.harga_bulanan).toLocaleString("id-ID")}
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/penghuni")}
                        className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Menyimpan..." : "Simpan Penghuni"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminTambahPenghuni;