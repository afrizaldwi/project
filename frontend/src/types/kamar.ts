export interface Kamar {
  id_kamar: number;
  nomor_kamar: string;
  luas_kamar: string;
  fasilitas: string;       // disimpan sebagai JSON string di DB, di-parse di frontend
  harga_bulanan: number;
  foto_kamar: string | null;
  status_kamar: "tersedia" | "terisi";
  created_at: string;
  updated_at: string;
}

export interface KamarStats {
  total: number;
  tersedia: number;
  terisi: number;
}

export interface KamarListResponse {
  data: Kamar[];
  total: number;
  tersedia: number;
  terisi: number;
}

export interface KamarFormData {
  nomor_kamar: string;
  luas_kamar: string;
  fasilitas: string;     // array di frontend, di-stringify sebelum kirim ke API
  harga_bulanan: string;
  status_kamar: "tersedia" | "terisi";
  foto_kamar: File | null;
}

export const defaultKamarForm = (): KamarFormData => ({
  nomor_kamar: "",
  luas_kamar: "",
  fasilitas: "",
  harga_bulanan: "",
  status_kamar: "tersedia",
  foto_kamar: null,
});