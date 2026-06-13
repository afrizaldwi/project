interface SummaryData {
  total_pemasukan: number;
  total_pengeluaran: number;
  laba_bersih: number;
  tagihan_belum_bayar: number;
}

interface LaporanSummaryCardsProps {
  summary: SummaryData | undefined;
  formatRupiah: (value: number) => string;
}

const LaporanSummaryCards = ({ summary, formatRupiah }: LaporanSummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-black text-dark/40">Total Pemasukan</p>
        <p className="mt-3 text-2xl font-black text-success">
          {formatRupiah(summary?.total_pemasukan ?? 0)}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-black text-dark/40">Total Pengeluaran</p>
        <p className="mt-3 text-2xl font-black text-danger">
          {formatRupiah(summary?.total_pengeluaran ?? 0)}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-black text-dark/40">Saldo Bersih</p>
        <p className="mt-3 text-2xl font-black text-primary">
          {formatRupiah(summary?.laba_bersih ?? 0)}
        </p>
      </div>
    </div>
  );
};

export default LaporanSummaryCards;
