import { CalendarDays, Download, Plus } from "lucide-react";

interface LaporanKeuanganHeaderProps {
  isLoading: boolean;
  hasInvoices: boolean;
  onExportCsv: () => void;
}

export const LaporanKeuanganHeader = ({
  isLoading,
  hasInvoices,
  onExportCsv,
}: LaporanKeuanganHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-black text-dark">Laporan Keuangan</h1>
        <p className="mt-1 text-sm font-medium text-dark/50">
          Export laporan transaksi pembayaran yang sudah diterima admin.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled
          title="Filter periode akan mengikuti fitur laporan keuangan Ima."
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-black text-dark/30"
        >
          <CalendarDays size={16} />
          Filter Periode
        </button>

        <button
          type="button"
          disabled
          title="Catat pengeluaran adalah bagian fitur Ima."
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-black text-dark/30"
        >
          <Plus size={16} />
          Catat Pengeluaran
        </button>

        <button
          type="button"
          onClick={onExportCsv}
          disabled={isLoading || !hasInvoices}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>
    </div>
  );
};
