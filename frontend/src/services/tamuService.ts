import api from "../api/axios";
import type { PenghuniAktifOption, Tamu, TamuPayload } from "../types";

interface ApiListResponse<T> {
    status: string;
    data: T;
}

const tamuService = {
    async getAdminTamu(): Promise<Tamu[]> {
        const response = await api.get<ApiListResponse<Tamu[]>>("/admin/tamu");
        return response.data.data;
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