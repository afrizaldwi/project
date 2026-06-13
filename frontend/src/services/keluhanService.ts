import api from "../api/axios";
import type {
    Keluhan,
    KeluhanPayload,
    KeluhanStatus,
    PaginatedResponse,
    PaginationParams,
} from "../types";

interface ApiListResponse<T> {
    status: string;
    data: T;
    message?: string;
}

type AdminKeluhanParams = PaginationParams & {
    status?: KeluhanStatus | "semua";
};

const keluhanService = {
    async getAdminKeluhan(params: AdminKeluhanParams = {}): Promise<PaginatedResponse<Keluhan>> {
        const response = await api.get<PaginatedResponse<Keluhan>>("/admin/keluhan", {
            params: {
                ...params,
                search: params.search?.trim() || undefined,
                status: params.status && params.status !== "semua" ? params.status : undefined,
            },
        });

        return response.data;
    },

    async getPenyewaKeluhan(status?: KeluhanStatus | "semua"): Promise<Keluhan[]> {
        const response = await api.get<ApiListResponse<Keluhan[]>>("/penyewa/keluhan", {
            params: status && status !== "semua" ? { status } : {},
        });

        return response.data.data;
    },

    async createKeluhan(payload: KeluhanPayload): Promise<Keluhan> {
        const formData = new FormData();

        formData.append("judul_keluhan", payload.judul_keluhan);
        formData.append("deskripsi_keluhan", payload.deskripsi_keluhan);

        if (payload.foto_kerusakan && payload.foto_kerusakan.length > 0) {
            payload.foto_kerusakan.forEach((file) => {
                formData.append("foto_kerusakan[]", file);
            });
        }

        const response = await api.post<ApiListResponse<Keluhan>>(
            "/penyewa/keluhan",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.data;
    },

    async updateStatus(id: number, status: KeluhanStatus): Promise<Keluhan> {
        const response = await api.patch<ApiListResponse<Keluhan>>(
            `/admin/keluhan/${id}/status`,
            {
                status_keluhan: status,
            }
        );

        return response.data.data;
    },

    async deleteKeluhan(id: number): Promise<void> {
        await api.delete(`/admin/keluhan/${id}`);
    },
};

export default keluhanService;