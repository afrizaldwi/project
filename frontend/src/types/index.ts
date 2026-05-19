export interface User {
  id: number;
  namaLengkap: string;
  email: string;
  role: "admin" | "penyewa";
  noHp: string;
  fotoProfil: string | null;
  alamatAsal: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  role: User["role"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export interface LoginResponse {
  message: string;
  user: User;
  token?: string;
}

export interface ProfileResponse {
  user: User;
}

export type DashboardSummary = {
  cards: {
    total_kamar: number;
    penghuni_aktif: number;
    tagihan_belum_dibayar: number;
    pendapatan_bulan_ini: number;
    keluhan_pending: number;
  };
  charts: {
    status_kamar: {
      tersedia: number;
      terisi: number;
      perbaikan: number;
    };
    status_tagihan: {
      belum_bayar: number;
      lunas: number;
      telat: number;
    };
    status_keluhan: {
      pending: number;
      proses: number;
      selesai: number;
    };
  };
  recent_keluhan: {
    judul: string;
    status: "pending" | "proses" | "selesai";
    tanggal: string;
  }[];
};

export type PenyewaDashboardSummary = {
  cards: {
    kamar_saya: string;
    tagihan_aktif: number;
    status_pembayaran: string;
    sisa_masa_sewa: string;
    keluhan_saya: number;
  };
  kamar: {
    nomor_kamar: string | null;
    fasilitas: string | null;
    harga_bulanan: number | null;
    status_kamar: string | null;
  } | null;
  tagihan_terbaru: {
    kode_invoice: string;
    tanggal_jatuh_tempo: string;
    total_tagihan: number;
    status_tagihan: string;
  } | null;
  kontrak: {
    tanggal_masuk: string;
    tanggal_keluar: string | null;
    durasi_sewa_bulan: number;
    status_sewa: string;
    progress_persen: number;
    sisa_masa_sewa: string;
  } | null;
  keluhan_terakhir: {
    judul: string;
    status: "pending" | "proses" | "selesai";
    tanggal: string;
  }[];
};

export type KamarStatus = "tersedia" | "terisi" | "perbaikan";

export interface Kamar {
  id_kamar: number;
  nomor_kamar: string;
  luas_kamar: string;
  fasilitas: string;
  harga_bulanan: number;
  foto_kamar: string | null;
  status_kamar: KamarStatus;
  created_at: string;
  updated_at: string;
}

export interface KamarStats {
  total: number;
  tersedia: number;
  terisi: number;
  perbaikan: number;
}

export interface KamarListResponse {
  data: Kamar[];
  total: number;
  tersedia: number;
  terisi: number;
  perbaikan: number;
}

export interface KamarFormData {
  nomor_kamar: string;
  luas_kamar: string;
  fasilitas: string;
  harga_bulanan: string;
  status_kamar: KamarStatus;
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

export interface SewaExtensionDetail {
  id_sewa: number;
  id_user: number;
  id_kamar: number;
  nama: string;
  email: string;
  no_hp: string;
  nomor_kamar: string;
  harga_bulanan: number;
  harga_deal: number;
  tanggal_masuk: string;
  tanggal_keluar: string;
  durasi_sewa_bulan: number;
  status_sewa: "aktif" | "selesai" | "batal";
}

export interface SewaExtensionPayload {
  tanggal_mulai: string;
  durasi_sewa_bulan: number;
  harga_deal: number;
}

export interface SewaExtensionResponse {
  message: string;
  data: {
    sewa: unknown;
    tagihan: unknown;
  };
}