import api from "./axios";

import type {
    NotifikasiItem,
    PendingPembayaranItem,
    TagihanReminderItem,
} from "../types";

export const tagihanReminderApi = {
    async getAdminTagihan() {
        const response = await api.get<{ data: TagihanReminderItem[] }>("/admin/tagihan");
        return response.data.data;
    },

    async getPenyewaTagihan() {
        const response = await api.get<{ data: TagihanReminderItem[] }>("/penyewa/tagihan");
        return response.data.data;
    },

    async uploadPaymentProof(idTagihan: number, payload: FormData) {
        const response = await api.post(`/penyewa/tagihan/${idTagihan}/bayar`, payload);
        return response.data;
    },

    async getPendingPayments() {
        const response = await api.get<{ data: PendingPembayaranItem[] }>(
            "/admin/pembayaran/pending"
        );

        return response.data.data;
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