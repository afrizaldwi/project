import api from "./axios";
import type {
    CreatePengeluaranPayload,
    KamarTersedia,
    LaporanKeuanganResponse,
    PaginatedResponse,
    PaginationParams,
    PengeluaranItem,
    PenghuniItem,
} from "../types";

type PenghuniStatus = "aktif" | "selesai" | "dibatalkan" | "all";

type PenghuniListParams = PaginationParams & {
    status?: PenghuniStatus;
};

const adminApi = {
    async getPenghuni(params: PenghuniListParams = {}): Promise<PaginatedResponse<PenghuniItem>> {
        const response = await api.get<PaginatedResponse<PenghuniItem>>("/admin/penghuni", {
            params: {
                ...params,
                search: params.search?.trim() || undefined,
                status: params.status ?? "aktif",
            },
        });

        return response.data;
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

    async exportLaporanKeuanganCsv(bulan?: number, tahun?: number) {
        const response = await api.get(
            "/admin/laporan-keuangan/export-csv",
            {
                params: { bulan, tahun },
                responseType: "blob",
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