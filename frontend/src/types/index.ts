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

export interface InvoiceUser {
  id: number | null;
  nama_lengkap: string | null;
  email: string | null;
  no_hp: string | null;
  alamat_asal: string | null;
}

export interface InvoiceKamar {
  id_kamar: number | null;
  nomor_kamar: string | null;
  luas_kamar: string | null;
  fasilitas: string | null;
  harga_bulanan: string | number | null;
}

export interface InvoiceSewa {
  id_sewa: number | null;
  tanggal_masuk: string | null;
  tanggal_keluar: string | null;
  durasi_sewa_bulan: number | null;
  harga_deal: string | number | null;
}

export interface InvoiceItem {
  id_pembayaran: number;
  id_tagihan: number;
  kode_invoice: string | null;
  tanggal_tagihan: string | null;
  tanggal_jatuh_tempo: string | null;
  tanggal_bayar: string | null;
  jumlah_bayar: string | number;
  total_tagihan: string | number;
  metode_pembayaran: string | null;
  status_verifikasi: "pending" | "diterima" | "ditolak";
  catatan_admin: string | null;
  penyewa: InvoiceUser;
  kamar: InvoiceKamar;
  sewa: InvoiceSewa;
}