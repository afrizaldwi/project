import { FileText, Lock, Receipt } from "lucide-react";

interface LaporanKeuanganSummaryProps {
  isLoading: boolean;
  totalInvoice: number;
  totalPembayaran: number;
}

const formatRupiah = (value: string | number | null | undefined) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

export const LaporanKeuanganSummary = ({
  isLoading,
  totalInvoice,
  totalPembayaran,
}: LaporanKeuanganSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
          <Receipt size={20} />
        </div>

        <p className="text-2xl font-black text-dark">
          {isLoading ? "-" : totalInvoice}
        </p>
        <p className="text-sm font-bold text-dark/40">Total Invoice</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-3 inline-flex rounded-xl bg-success/10 p-2 text-success">
          <FileText size={20} />
        </div>

        <p className="text-2xl font-black text-dark">
          {isLoading ? "-" : formatRupiah(totalPembayaran)}
        </p>
        <p className="text-sm font-bold text-dark/40">
          Total Pembayaran Diterima
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-3 inline-flex rounded-xl bg-dark/5 p-2 text-dark/30">
          <Lock size={20} />
        </div>

        <p className="text-lg font-black text-dark/40">
          Menunggu Integrasi
        </p>
        <p className="mt-1 text-sm font-semibold text-dark/30">
          Ringkasan pengeluaran dan saldo bersih akan mengikuti fitur Ima.
        </p>
      </div>
    </div>
  );
};
