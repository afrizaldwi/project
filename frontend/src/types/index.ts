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
}

export interface ProfileResponse {
  user: User;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  summary?: any;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
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

export interface TagihanReminderItem {
  id_tagihan: number;
  id_sewa: number;
  kode_invoice: string;
  tanggal_tagihan: string;
  tanggal_jatuh_tempo: string;
  total_tagihan: string | number;
  status_tagihan: string;
  pembayaran_terbaru?: PembayaranTerbaru | null;
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
  last_reminded_at?: string | null;
  reminder_count?: number;
}

export interface PembayaranTerbaru {
  id_pembayaran: number;
  tanggal_bayar: string;
  jumlah_bayar: string | number;
  metode_pembayaran: string;
  bukti_bayar: string | null;
  bukti_bayar_url: string | null;
  status_verifikasi: "pending" | "diterima" | "ditolak";
  catatan_admin: string | null;
}

export interface PendingPembayaranItem {
  id_pembayaran: number;
  id_tagihan: number;
  tanggal_bayar: string;
  jumlah_bayar: string | number;
  metode_pembayaran: string;
  bukti_bayar: string | null;
  bukti_bayar_url: string | null;
  status_verifikasi: "pending" | "diterima" | "ditolak";
  catatan_admin: string | null;
  tagihan: TagihanReminderItem | null;
}

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

export type LandingKamar = {
  id_kamar: number;
  tipe_kamar: string;
  harga_bulanan: number | string;
  status_kamar: KamarStatus;
  foto_url?: string | null;
};


export interface KamarStats {
  total: number;
  tersedia: number;
  terisi: number;
  perbaikan: number;
}

export interface KamarListResponse extends PaginatedResponse<Kamar> {
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

export interface Tamu {
  id_tamu: number;
  nama_tamu: string;
  no_hp_tamu: string;
  keperluan: string;
  waktu_berkunjung: string;
  id_user: number;
  nama_penghuni: string;
  nomor_kamar: string;
}

export interface PenghuniAktifOption {
  id_user: number;
  nama_penghuni: string;
  email: string;
  nomor_kamar: string;
}

export interface TamuPayload {
  nama_tamu: string;
  no_hp_tamu: string;
  keperluan: string;
  id_user?: number | string;
}

export type KeluhanStatus = "pending" | "proses" | "selesai";

export interface Keluhan {
  id_keluhan: number;
  id_sewa: number;
  judul_keluhan: string;
  deskripsi_keluhan: string;
  foto_kerusakan: string | null;
  foto_kerusakan_url: string | null;
  foto_kerusakan_urls?: string[];
  status_keluhan: KeluhanStatus;
  tanggal_lapor: string;
  tanggal_selesai: string | null;
  nama_penghuni: string;
  email_penghuni: string;
  nomor_kamar: string;
}

export interface KeluhanPayload {
  judul_keluhan: string;
  deskripsi_keluhan: string;
  foto_kerusakan?: File[] | null;
}
export type VisitorBrowserName =
  | "Brave"
  | "Edge"
  | "Opera"
  | "Samsung Internet"
  | "Firefox"
  | "Safari"
  | "Chrome"
  | "Unknown";

export interface DailyVisitorItem {
  date: string;
  unique_visitors: number;
}

export interface LocationVisitorItem {
  country: string;
  city: string;
  unique_visitors: number;
}

export interface BrowserVisitorItem {
  browser_name: VisitorBrowserName | "Tidak diketahui";
  unique_visitors: number;
}

export interface VisitorConsentSummary {
  analytics_allowed: number;
  location_allowed: number;
  location_rejected: number;
  browser_allowed: number;
  browser_rejected: number;
}

export interface VisitorStatsResponse {
  total_unique_visitors: number;
  today_unique_visitors: number;
  top_location: {
    country: string;
    city: string;
    total: number;
  };
  top_browser: {
    browser_name: VisitorBrowserName | "Tidak diketahui";
    total: number;
  };
  daily_visitors: DailyVisitorItem[];
  location_visitors: LocationVisitorItem[];
  browser_visitors: BrowserVisitorItem[];
  consent_summary: VisitorConsentSummary;
}

export type VisitorPeriod = "7" | "30" | "90" | "all";
