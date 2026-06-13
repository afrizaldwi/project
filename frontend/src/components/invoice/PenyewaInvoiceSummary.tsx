import { Receipt, FileText } from "lucide-react";

interface PenyewaInvoiceSummaryProps {
  totalInvoice: number;
  totalPaid: number;
}

const formatRupiah = (value: string | number | null | undefined) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

export const PenyewaInvoiceSummary = ({
  totalInvoice,
  totalPaid,
}: PenyewaInvoiceSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
          <Receipt size={20} />
        </div>

        <p className="text-2xl font-black text-dark">{totalInvoice}</p>
        <p className="text-sm font-bold text-dark/40">Total Invoice</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 inline-flex rounded-xl bg-success/10 p-2 text-success">
          <FileText size={20} />
        </div>

        <p className="text-2xl font-black text-dark">
          {formatRupiah(totalPaid)}
        </p>
        <p className="text-sm font-bold text-dark/40">Total Dibayar</p>
      </div>
    </div>
  );
};
