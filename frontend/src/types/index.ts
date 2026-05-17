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

export interface TagihanReminderItem {
  id_tagihan: number;
  id_sewa: number;
  kode_invoice: string;
  tanggal_tagihan: string;
  tanggal_jatuh_tempo: string;
  total_tagihan: string | number;
  status_tagihan: string;
  penyewa: {
    id: number | null;
    nama_lengkap: string | null;
    email: string | null;
    no_hp: string | null;
  };
  kamar: {
    id_kamar: number | null;
    nomor_kamar: string | null;
  };
  peringatan: {
    aktif: boolean;
    status: "akan_jatuh_tempo" | "terlambat" | null;
    hari_tersisa: number | null;
    judul: string | null;
    pesan: string | null;
  };
  notifikasi: {
    aktif: boolean;
    judul: string | null;
    pesan: string | null;
  };
  whatsapp: {
    enabled: boolean;
    phone: string;
    message: string;
    url: string | null;
  };
}

export interface NotifikasiItem {
  id: number;
  id_tagihan: number;
  role_target: "admin" | "penyewa";
  tipe: string;
  judul: string;
  pesan: string;
  is_read: boolean;
  created_at: string;
  tagihan: TagihanReminderItem | null;
}