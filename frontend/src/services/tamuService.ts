import api from "../api/axios";
import type {
    PaginatedResponse,
    PaginationParams,
    PenghuniAktifOption,
    Tamu,
    TamuPayload,
} from "../types";

interface ApiListResponse<T> {
    status: string;
    data: T;
}

const tamuService = {
    async getAdminTamu(params: PaginationParams = {}): Promise<PaginatedResponse<Tamu>> {
        const response = await api.get<PaginatedResponse<Tamu>>("/admin/tamu", {
            params: {
                ...params,
                search: params.search?.trim() || undefined,
            },
        });
        return response.data;
    },

    async getPenyewaTamu(): Promise<Tamu[]> {
        const response = await api.get<ApiListResponse<Tamu[]>>("/penyewa/tamu");

        return response.data.data;
    },

    async getPenghuniAktif(): Promise<PenghuniAktifOption[]> {
        const response = await api.get<ApiListResponse<PenghuniAktifOption[]>>(
            "/admin/tamu/penghuni-aktif"
        );

        return response.data.data;
    },

    async createAdminTamu(payload: TamuPayload): Promise<Tamu> {
        const response = await api.post<ApiListResponse<Tamu>>("/admin/tamu", payload);
        return response.data.data;
    },

    async createPenyewaTamu(payload: TamuPayload): Promise<Tamu> {
        const response = await api.post<ApiListResponse<Tamu>>("/penyewa/tamu", payload);
        return response.data.data;
    },

    async deleteTamu(id: number): Promise<void> {
        await api.delete(`/admin/tamu/${id}`);
    },
};

export default tamuService;