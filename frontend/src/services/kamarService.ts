import api from "../api/axios";
import type { Kamar, KamarFormData, KamarListResponse } from "../types";

const kamarService = {
  async getAll(): Promise<KamarListResponse> {
    const response = await api.get<KamarListResponse>("/admin/kamar");
    return response.data;
  },

  async getById(id: number): Promise<Kamar> {
    const response = await api.get<{ data: Kamar }>(`/admin/kamar/${id}`);
    return response.data.data;
  },

  async create(formData: KamarFormData): Promise<Kamar> {
    const payload = buildFormData(formData);

    const response = await api.post<{ data: Kamar }>("/admin/kamar", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  async update(id: number, formData: KamarFormData): Promise<Kamar> {
    const payload = buildFormData(formData);
    payload.append("_method", "PATCH");

    const response = await api.post<{ data: Kamar }>(`/admin/kamar/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/kamar/${id}`);
  },
};

function buildFormData(data: KamarFormData): FormData {
  const payload = new FormData();

  payload.append("nomor_kamar", data.nomor_kamar);
  payload.append("luas_kamar", data.luas_kamar);
  payload.append("fasilitas", data.fasilitas);
  payload.append("harga_bulanan", data.harga_bulanan);
  payload.append("status_kamar", data.status_kamar);

  if (data.foto_kamar) {
    payload.append("foto_kamar", data.foto_kamar);
  }

  return payload;
}

export default kamarService;