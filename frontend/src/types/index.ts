// ======================================================
// Shared / Common Types
// ======================================================

export type ApiStatus = "success" | "error";

export interface ApiResponse<T> {
  status?: ApiStatus;
  message?: string;
  data: T;
}

// ======================================================
// Admin Penghuni Types - Ima
// ======================================================

export interface PenghuniUser {
  id: number;
  nama_lengkap: string;
  email: string;
  no_hp: string | null;
  alamat_asal?: string | null;
}

export interface PenghuniKamar {
  id_kamar: number;
  nomor_kamar: string;
  luas_kamar?: string | null;
  fasilitas?: string | null;
  harga_bulanan: string | number;
  status_kamar?: "tersedia" | "terisi" | "perbaikan";
}

export interface PenghuniItem {
  id_sewa: number;
  id_user: number;
  id_kamar: number;
  tanggal_masuk: string;
  tanggal_keluar: string | null;
  durasi_sewa_bulan: number;
  harga_deal: string | number;
  status_sewa: "aktif" | "selesai" | "dibatalkan" | "batal";
  user: PenghuniUser | null;
  kamar: PenghuniKamar | null;
}

export interface AvailableRoom {
  id_kamar: number;
  nomor_kamar: string;
  luas_kamar: string;
  fasilitas: string;
  harga_bulanan: string | number;
  status_kamar: "tersedia" | "terisi" | "perbaikan";
}

export type AvailableKamar = AvailableRoom;

export interface CreatePenghuniPayload {
  nama_lengkap: string;
  email: string;
  password: string;
  no_hp: string;
  alamat_asal?: string;
  id_kamar: number | string;
  tanggal_masuk: string;
  durasi_sewa_bulan: number | string;
  harga_deal: number | string;
}

// ======================================================
// Laporan Keuangan Types - Ima
// ======================================================

export interface PembayaranLaporanItem {
  id_pembayaran: number;
  tanggal_bayar: string;
  jumlah_bayar: string | number;
  metode_pembayaran: string;
  status_verifikasi: "pending" | "diterima" | "ditolak";
  tagihan?: {
    id_tagihan: number;
    kode_invoice: string;
    total_tagihan: string | number;
    riwayat_sewa?: {
      user?: {
        nama_lengkap?: string | null;
      } | null;
      kamar?: {
        nomor_kamar?: string | null;
      } | null;
    } | null;
  } | null;
}

export interface LaporanKeuanganSummary {
  bulan: number;
  tahun: number;
  total_pemasukan: string | number;
  total_pengeluaran: string | number;
  saldo_bersih: string | number;
  jumlah_tagihan_lunas: number;
  jumlah_penghuni_aktif: number;
  pembayaran_terbaru?: PembayaranLaporanItem[];
}

export interface PengeluaranItem {
  id_pengeluaran: number;
  tanggal_pengeluaran: string;
  kategori: string;
  deskripsi: string;
  nominal: string | number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePengeluaranPayload {
  tanggal_pengeluaran: string;
  kategori: string;
  deskripsi: string;
  nominal: number | string;
}

// ======================================================
// Tagihan / Reminder / Pembayaran Types - Riyana
// ======================================================

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

// ======================================================
// Invoice Types - Salsa
// ======================================================

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

// ======================================================
// Kamar / Room Types - Falissa
// ======================================================

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

// ======================================================
// Sewa Extension Types - Falissa
// ======================================================

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
  status_sewa: "aktif" | "selesai" | "dibatalkan" | "batal";
}

export interface SewaExtensionPayload {
  tanggal_mulai: string;
  durasi_sewa_bulan: number;
  harga_deal: number;
}

export interface SewaExtensionResponse {
  message: string;
  data: {
    sewa: SewaExtensionDetail;
    tagihan: unknown;
  };
}