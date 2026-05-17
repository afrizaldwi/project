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

export interface PenghuniUser {
  id: number;
  nama_lengkap: string;
  email: string;
  no_hp: string;
  alamat_asal: string | null;
  foto_profil: string | null;
}

export interface PenghuniKamar {
  id_kamar: number;
  nomor_kamar: string;
  fasilitas: string;
  harga_bulanan: string | number;
  luas_kamar: string;
  foto_kamar: string | null;
  status_kamar: string;
}

export interface PenghuniItem {
  id_sewa: number;
  tanggal_masuk: string;
  tanggal_keluar: string | null;
  harga_deal: string | number;
  durasi_sewa_bulan: number;
  status_sewa: "aktif" | "selesai" | "dibatalkan";
  user: PenghuniUser;
  kamar: PenghuniKamar;
}

export interface KamarTersedia {
  id_kamar: number;
  nomor_kamar: string;
  fasilitas: string;
  harga_bulanan: string | number;
  luas_kamar: string;
  foto_kamar: string | null;
  status_kamar: string;
}

export interface CreatePenghuniPayload {
  nama_lengkap: string;
  email: string;
  password: string;
  no_hp: string;
  alamat_asal?: string;
  id_kamar: number;
  tanggal_masuk: string;
  durasi_sewa_bulan: number;
}

export interface PengeluaranItem {
  id_pengeluaran: number;
  judul_pengeluaran: string;
  deskripsi: string | null;
  jumlah_pengeluaran: string | number;
  tanggal_pengeluaran: string;
  bukti_foto?: string | null;
  dibuat_oleh?: number;
  pencatat?: {
    id: number;
    nama_lengkap: string;
    email: string;
  } | null;
}

export interface CreatePengeluaranPayload {
  judul_pengeluaran: string;
  deskripsi?: string;
  jumlah_pengeluaran: number;
  tanggal_pengeluaran: string;
  bukti_foto?: string | null;
}

export interface LaporanKeuanganResponse {
  periode: {
    bulan: number;
    tahun: number;
  };
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    laba_bersih: number;
    tagihan_belum_bayar: number;
  };
  pembayaran_terbaru: Array<{
    id_pembayaran: number;
    nama_lengkap: string | null;
    kode_invoice: string | null;
    tanggal_bayar: string;
    jumlah_bayar: string | number;
    metode_pembayaran: string;
    status_verifikasi: string;
  }>;
  pengeluaran_terbaru: PengeluaranItem[];
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
