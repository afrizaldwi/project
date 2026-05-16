/**
 * kamarService — Facade Pattern
 * Menyembunyikan detail Axios dan endpoint dari komponen UI.
 * Komponen cukup panggil kamarService.getAll(), .create(), dst.
 */

import api from "../api/axios";
import type { KamarFormData, KamarListResponse, Kamar } from "../types/kamar";

const kamarService = {
  async getAll(): Promise<KamarListResponse> {
    const res = await api.get<KamarListResponse>("/kamar");
    return res.data;
  },

  async getById(id: number): Promise<Kamar> {
    const res = await api.get<{ data: Kamar }>(`/kamar/${id}`);
    return res.data.data;
  },

  async create(formData: KamarFormData): Promise<Kamar> {
    const payload = buildFormData(formData);
    const res = await api.post<{ data: Kamar }>("/kamar", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async update(id: number, formData: KamarFormData): Promise<Kamar> {
    const payload = buildFormData(formData);
    const res = await api.post<{ data: Kamar }>(`/kamar/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/kamar/${id}`);
  },
};

/** Helper: ubah KamarFormData → FormData untuk multipart upload */
function buildFormData(data: KamarFormData): FormData {
  const fd = new FormData();
  fd.append("nomor_kamar", data.nomor_kamar);
  fd.append("luas_kamar", data.luas_kamar);
  fd.append("fasilitas", data.fasilitas);  // ← langsung string, bukan JSON.stringify
  fd.append("harga_bulanan", data.harga_bulanan);
  fd.append("status_kamar", data.status_kamar);
  if (data.foto_kamar) {
    fd.append("foto_kamar", data.foto_kamar);
  }
  return fd;
}

export default kamarService;