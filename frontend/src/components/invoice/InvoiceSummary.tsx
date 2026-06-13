import { Receipt, CheckCircle } from "lucide-react";

interface InvoiceSummaryProps {
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

export const InvoiceSummary = ({ totalInvoice, totalPembayaran }: InvoiceSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
          <Receipt size={20} />
        </div>

        <p className="text-2xl font-black text-dark">
          {totalInvoice}
        </p>
        <p className="text-sm font-bold text-dark/40">Total Invoice</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 inline-flex rounded-xl bg-success/10 p-2 text-success">
          <CheckCircle size={20} />
        </div>

        <p className="text-2xl font-black text-dark">
          {formatRupiah(totalPembayaran)}
        </p>
        <p className="text-sm font-bold text-dark/40">
          Total Pembayaran Diterima
        </p>
      </div>
    </div>
  );
};
