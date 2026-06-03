type DashboardCards = {
  total_kamar: number;
  penghuni_aktif: number;
  tagihan_belum_dibayar: number;
  pendapatan_bulan_ini: number;
  keluhan_pending: number;
};

type DashboardCardItem = {
  title: string;
  value: string | number;
};

type PenyewaDashboardCards = {
  kamar_saya: string;
  tagihan_aktif: number;
  status_pembayaran: string;
  sisa_masa_sewa: string;
  keluhan_saya: number;
};

const formatStatusPembayaran = (status: string) => {
  if (status === "belum_bayar") {
    return "Belum Bayar";
  }

  if (status === "lunas") {
    return "Lunas";
  }

  if (status === "telat") {
    return "Telat";
  }

  return status;
};

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const dashboardCardAdapter = {
  toAdminDashboardCards(cards: DashboardCards): DashboardCardItem[] {
    return [
      {
        title: "Total Kamar",
        value: cards.total_kamar,
      },
      {
        title: "Penghuni Aktif",
        value: cards.penghuni_aktif,
      },
      {
        title: "Tagihan Belum Dibayar",
        value: cards.tagihan_belum_dibayar,
      },
      {
        title: "Pendapatan Bulan Ini",
        value: formatRupiah(cards.pendapatan_bulan_ini),
      },
      {
        title: "Keluhan Menunggu",
        value: cards.keluhan_pending,
      },
    ];
  },

  toPenyewaDashboardCards(cards: PenyewaDashboardCards): DashboardCardItem[] {
    return [
      {
        title: "Kamar Saya",
        value: cards.kamar_saya,
      },
      {
        title: "Tagihan Aktif",
        value: cards.tagihan_aktif,
      },
      {
        title: "Status Pembayaran",
        value: formatStatusPembayaran(cards.status_pembayaran),
      },
      {
        title: "Sisa Masa Sewa",
        value: cards.sisa_masa_sewa,
      },
      {
        title: "Keluhan Saya",
        value: cards.keluhan_saya,
      },
    ];
  },
};