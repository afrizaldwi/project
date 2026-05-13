export interface Billing {
  id: string;
  penyewa: string;
  kamar: string;
  totalTagihan: number;
  jatuhTempo: string;
  status: string;
}

export interface TransactionHistory {
  id: string;
  invoiceNumber: string;
  penyewa: string;
  jumlah: number;
  status: string;
  tanggal: string;
}

export interface BillingSummary {
  total: number;
  lunas: number;
  belumBayar: number;
  menunggu: number;
}
