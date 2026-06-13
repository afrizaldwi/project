import { Download } from "lucide-react";
import type { InvoiceItem } from "../../types";

interface InvoiceMobileListProps {
  invoices: InvoiceItem[];
  isLoading: boolean;
  downloadingId: number | null;
  onDownload: (invoice: InvoiceItem) => void;
}

const formatRupiah = (value: string | number | null | undefined) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const InvoiceMobileList = ({
  invoices,
  isLoading,
  downloadingId,
  onDownload,
}: InvoiceMobileListProps) => {
  return (
    <div className="space-y-3 p-4 md:hidden">
      {isLoading ? (
        <div className="rounded-xl bg-light p-5 text-center text-sm font-semibold text-dark/50">
          Memuat data...
        </div>
      ) : invoices.length === 0 ? (
        <div className="rounded-xl bg-light p-5 text-center text-sm font-semibold text-dark/50">
          Tidak ada invoice.
        </div>
      ) : (
        invoices.map((invoice) => (
          <div
            key={invoice.id_pembayaran}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-black text-dark">
                  {invoice.kode_invoice || "-"}
                </p>
                <p className="truncate text-xs font-medium text-dark/40">
                  {invoice.penyewa.nama_lengkap || "-"} • Kamar{" "}
                  {invoice.kamar.nomor_kamar || "-"}
                </p>
              </div>

              <p className="shrink-0 font-black text-success">
                {formatRupiah(invoice.jumlah_bayar)}
              </p>
            </div>

            <div className="mt-3 rounded-xl bg-light p-3 text-xs font-medium text-dark/60">
              <p>Tanggal bayar: {formatDate(invoice.tanggal_bayar)}</p>
              <p className="capitalize">
                Metode: {invoice.metode_pembayaran || "-"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDownload(invoice)}
              disabled={downloadingId === invoice.id_pembayaran}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-black text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={14} />
              {downloadingId === invoice.id_pembayaran
                ? "Memproses..."
                : "Unduh PDF"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};
