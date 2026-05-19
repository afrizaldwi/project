import api from "./axios";

import type { InvoiceItem } from "../types";

export const invoiceApi = {
    async getAdminInvoices() {
        const response = await api.get<{ data: InvoiceItem[] }>("/admin/invoices");
        return response.data.data;
    },

    async getPenyewaInvoices() {
        const response = await api.get<{ data: InvoiceItem[] }>("/penyewa/invoices");
        return response.data.data;
    },

    async downloadAdminInvoicePdf(idPembayaran: number) {
        const response = await api.get(`/admin/invoices/${idPembayaran}/pdf`, {
            responseType: "blob",
        });

        return response.data as Blob;
    },

    async downloadPenyewaInvoicePdf(idPembayaran: number) {
        const response = await api.get(`/penyewa/invoices/${idPembayaran}/pdf`, {
            responseType: "blob",
        });

        return response.data as Blob;
    },
};

export const downloadPdfBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
};