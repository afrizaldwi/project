import {
    type ChangeEvent,
    type FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import adminApi from "../../api/admin";
import type { KamarTersedia } from "../../types";
import FormDataPenghuni from "../../components/admin/FormDataPenghuni";
import FormDataSewa from "../../components/admin/FormDataSewa";
import FormActions from "../../components/admin/FormActions";
import PenghuniCredentialsSuccess from "../../components/admin/PenghuniCredentialsSuccess";

interface CreatedCredentials {
    email: string;
    temporary_password: string;
}

interface CreatePenghuniResponse {
    message: string;
    id_user: number;
    id_sewa: number;
    credentials: CreatedCredentials;
    no_hp: string;
}

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

const defaultForm = () => ({
    nama_lengkap: "",
    email: "",
    password: "",
    no_hp: "",
    alamat_asal: "",
    id_kamar: "",
    tanggal_masuk: new Date().toISOString().slice(0, 10),
    durasi_sewa_bulan: "1",
    metode_pembayaran: "",
    bukti_bayar: null as File | null,
});

const AdminTambahPenghuni = () => {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState<KamarTersedia[]>([]);
    const [selectedType, setSelectedType] = useState("");
    const [isLoadingRooms, setIsLoadingRooms] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);
    const [createdPhoneNumber, setCreatedPhoneNumber] = useState("");
    const [form, setForm] = useState(defaultForm());

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

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
        const digits = event.target.value.replace(/\D/g, "");

        setForm((previous) => ({
            ...previous,
            no_hp: digits,
        }));
    };

    const handleBuktiBayarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        setForm((previous) => ({
            ...previous,
            bukti_bayar: file,
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
        setCreatedCredentials(null);

        if (!form.alamat_asal.trim()) {
            setErrorMessage("Alamat asal wajib diisi.");
            return;
        }

        if (!form.metode_pembayaran) {
            setErrorMessage("Pilih metode pembayaran awal.");
            return;
        }

        if (!form.bukti_bayar) {
            setErrorMessage("Bukti pembayaran awal wajib diunggah.");
            return;
        }

        if (!form.id_kamar) {
            setErrorMessage("Pilih kamar terlebih dahulu.");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = new FormData();

            payload.append("nama_lengkap", form.nama_lengkap);
            payload.append("no_hp", form.no_hp);
            payload.append("alamat_asal", form.alamat_asal || "");
            payload.append("id_kamar", String(form.id_kamar));
            payload.append("tanggal_masuk", form.tanggal_masuk);
            payload.append("durasi_sewa_bulan", String(form.durasi_sewa_bulan));
            payload.append("metode_pembayaran", form.metode_pembayaran);

            if (form.bukti_bayar) {
                payload.append("bukti_bayar", form.bukti_bayar);
            }

            const result = await adminApi.createPenghuni(payload) as CreatePenghuniResponse;

            setCreatedCredentials(result.credentials);
            setCreatedPhoneNumber(result.no_hp);
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
                </div>

                {errorMessage && (
                    <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
                        {errorMessage}
                    </div>
                )}

                {createdCredentials && (
                    <PenghuniCredentialsSuccess
                        credentials={createdCredentials}
                        phoneNumber={createdPhoneNumber}
                        onGoToPenghuni={() => navigate("/admin/penghuni")}
                    />
                )}

                {!createdCredentials && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormDataPenghuni
                            form={form}
                            onChange={handleChange}
                            onPhoneChange={handlePhoneChange}
                            onBuktiBayarChange={handleBuktiBayarChange}
                        />

                        <FormDataSewa
                            form={form}
                            onChange={handleChange}
                            isLoadingRooms={isLoadingRooms}
                            roomTypes={roomTypes}
                            selectedType={selectedType}
                            selectedTypeRooms={selectedTypeRooms}
                            selectedRoom={selectedRoom}
                            totalTagihan={totalTagihan}
                            estimasiCheckOut={estimasiCheckOut}
                            formatRupiah={formatRupiah}
                            onTypeSelect={handleTypeSelect}
                            onRoomSelect={handleRoomSelect}
                        />

                        <FormActions
                            isSubmitting={isSubmitting}
                            onCancel={() => navigate("/admin/penghuni")}
                        />
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminTambahPenghuni;
