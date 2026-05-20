import api from "../api/axios";
import type {
    SewaExtensionDetail,
    SewaExtensionPayload,
    SewaExtensionResponse,
} from "../types";

const sewaExtensionService = {
    async getAll(): Promise<SewaExtensionDetail[]> {
        const response = await api.get<{ data: SewaExtensionDetail[] }>("/admin/sewa");
        return response.data.data;
    },

    async getById(id: number): Promise<SewaExtensionDetail> {
        const response = await api.get<{ data: SewaExtensionDetail }>(`/admin/sewa/${id}`);
        return response.data.data;
    },

    async perpanjang(
        id: number,
        payload: SewaExtensionPayload
    ): Promise<SewaExtensionResponse> {
        const response = await api.patch<SewaExtensionResponse>(
            `/admin/sewa/${id}/perpanjang`,
            payload
        );

        return response.data;
    },
};

export default sewaExtensionService;