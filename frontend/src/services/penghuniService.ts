import api from "../api/axios";

const penghuniService = {
  async getAll() {
    const res = await api.get("/penghuni");
    return res.data;
  },

  async getById(id: number) {
    const res = await api.get(`/penghuni/${id}`);
    return res.data.data;
  },

  async getKamarTersedia() {
    const res = await api.get("/kamar");
    return res.data.data.filter((k: any) => k.status_kamar === "tersedia");
  },

  async create(data: any) {
    const res = await api.post("/penghuni", data);
    return res.data;
  },

  async perpanjang(id: number, data: any) {
    const res = await api.post(`/penghuni/${id}/perpanjang`, data);
    return res.data;
  },

  async updateStatus(id: number, status: string) {
    const res = await api.patch(`/penghuni/${id}/status`, { status_sewa: status });
    return res.data;
  },
};

export default penghuniService;