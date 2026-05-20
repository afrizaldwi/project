import { CheckCircle, Download } from "lucide-react";
import type { InvoiceItem } from "../../types";

interface PenyewaInvoiceListProps {
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
    month: "long",
    year: "numeric",
  });
};

export const PenyewaInvoiceList = ({
  invoices,
  isLoading,
  downloadingId,
  onDownload,
}: PenyewaInvoiceListProps) => {
  return (
    <>
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm font-semibold text-dark/50 shadow-sm">
          Memuat data tagihan...
        </div>
      ) : invoices.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto mb-3 text-success" size={32} />
          <p className="font-black text-dark">Belum ada invoice.</p>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Invoice akan muncul setelah pembayaran kamu diterima admin.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id_pembayaran}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-dark/40">
                    {invoice.kode_invoice || "-"}
                  </p>
                  <h3 className="mt-1 text-lg font-black text-dark">
                    Kamar {invoice.kamar.nomor_kamar || "-"}
                  </h3>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-[10px] font-black uppercase text-success">
                  <CheckCircle size={13} />
                  Lunas
                </span>
              </div>

              <div className="grid gap-3 rounded-xl bg-light p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase text-dark/40">
                    Total Dibayar
                  </p>
                  <p className="mt-1 text-xl font-black text-dark">
                    {formatRupiah(invoice.jumlah_bayar)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-dark/40">
                    Tanggal Bayar
                  </p>
                  <p className="mt-1 font-black text-dark">
                    {formatDate(invoice.tanggal_bayar)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-dark/40">
                    Jatuh Tempo
                  </p>
                  <p className="mt-1 font-black text-dark">
                    {formatDate(invoice.tanggal_jatuh_tempo)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-dark/40">
                    Metode
                  </p>
                  <p className="mt-1 font-black capitalize text-dark">
                    {invoice.metode_pembayaran || "-"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDownload(invoice)}
                disabled={downloadingId === invoice.id_pembayaran}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={16} />
                {downloadingId === invoice.id_pembayaran
                  ? "Memproses..."
                  : "Download Invoice PDF"}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
