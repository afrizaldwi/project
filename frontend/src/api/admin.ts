import api from "./axios";
import type {
    CreatePengeluaranPayload,
    KamarTersedia,
    LaporanKeuanganResponse,
    PengeluaranItem,
    PenghuniItem,
} from "../types";

const adminApi = {
    async getPenghuni(
        status: "aktif" | "selesai" | "dibatalkan" | "all" = "aktif"
    ) {
        const response = await api.get<{ data: PenghuniItem[] }>("/admin/penghuni", {
            params: { status },
        });

        return response.data.data;
    },

    async getKamarTersedia() {
        const response = await api.get<{ data: KamarTersedia[] }>(
            "/admin/kamar/tersedia"
        );

        return response.data.data;
    },

    createPenghuni: async (payload: FormData) => {
        const response = await api.post("/admin/penghuni", payload);

        return response.data;
    },

    async finishSewa(idSewa: number, tanggalKeluar?: string) {
        const response = await api.patch(`/admin/penghuni/${idSewa}/selesaikan`, {
            tanggal_keluar: tanggalKeluar,
        });

        return response.data;
    },

    async getLaporanKeuangan(bulan?: number, tahun?: number) {
        const response = await api.get<LaporanKeuanganResponse>(
            "/admin/laporan-keuangan",
            {
                params: { bulan, tahun },
            }
        );

        return response.data;
    },

    async getPengeluaran(bulan?: number, tahun?: number) {
        const response = await api.get<{ data: PengeluaranItem[] }>(
            "/admin/pengeluaran",
            {
                params: { bulan, tahun },
            }
        );

        return response.data.data;
    },

    async createPengeluaran(payload: CreatePengeluaranPayload) {
        const response = await api.post("/admin/pengeluaran", payload);
        return response.data;
    },

    async deletePengeluaran(idPengeluaran: number) {
        const response = await api.delete(`/admin/pengeluaran/${idPengeluaran}`);
        return response.data;
    },
};

export default adminApi