import api from "./axios";

import type {
    NotifikasiItem,
    PaginatedResponse,
    PaginationParams,
    PendingPembayaranItem,
    TagihanReminderItem,
} from "../types";

export const tagihanReminderApi = {
    async getAdminTagihan(params: PaginationParams = {}) {
        const response = await api.get<PaginatedResponse<TagihanReminderItem>>(
            "/admin/tagihan",
            { params }
        );
        console.log(response.data);

        return response.data;
    },

    async getPenyewaTagihan() {
        const response = await api.get<{ data: TagihanReminderItem[] }>("/penyewa/tagihan");
        return response.data.data;
    },

    async uploadPaymentProof(idTagihan: number, payload: FormData) {
        const response = await api.post(`/penyewa/tagihan/${idTagihan}/bayar`, payload);
        return response.data;
    },

    async getPendingPayments(params: PaginationParams = {}) {
        const response = await api.get<PaginatedResponse<PendingPembayaranItem>>(
            "/admin/pembayaran/pending",
            { params }
        );

        return response.data;
    },

    async verifyPayment(idPembayaran: number, catatanAdmin?: string) {
        const response = await api.patch(`/admin/pembayaran/${idPembayaran}/verify`, {
            catatan_admin: catatanAdmin || null,
        });

        return response.data;
    },

    async rejectPayment(idPembayaran: number, catatanAdmin?: string) {
        const response = await api.patch(`/admin/pembayaran/${idPembayaran}/reject`, {
            catatan_admin: catatanAdmin || null,
        });

        return response.data;
    },

    async getNotifications(unread = false) {
        const response = await api.get<{ data: NotifikasiItem[] }>("/notifikasi", {
            params: unread ? { unread: 1 } : {},
        });

        return response.data.data;
    },

    async markNotificationAsRead(idNotifikasi: number) {
        const response = await api.patch(`/notifikasi/${idNotifikasi}/read`);
        return response.data;
    },

    async runDueDateCheck() {
        const response = await api.post("/admin/tagihan/check-jatuh-tempo");
        return response.data;
    },
};