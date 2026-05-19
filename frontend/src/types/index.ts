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