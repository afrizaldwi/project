import api from "./axios";
import type { NotifikasiItem, TagihanReminderItem } from "../types";

export const tagihanReminderApi = {
    async getAdminTagihan() {
        const response = await api.get<{ data: TagihanReminderItem[] }>(
            "/admin/tagihan"
        );

        return response.data.data;
    },

    async getPenyewaTagihan() {
        const response = await api.get<{ data: TagihanReminderItem[] }>(
            "/penyewa/tagihan"
        );

        return response.data.data;
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