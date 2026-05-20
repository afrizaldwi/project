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
import FormDataPenghuni from "../../components/admin/FormDataPenghuni";
import FormDataSewa from "../../components/admin/FormDataSewa";
import FormActions from "../../components/admin/FormActions";

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
                    <FormDataPenghuni form={form} onChange={handleChange} />

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
            </div>
        </div>
    );
};

export default AdminTambahPenghuni;