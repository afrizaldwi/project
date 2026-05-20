import { CheckCircle, Download } from "lucide-react";
import type { InvoiceItem } from "../../types";

interface InvoiceTableProps {
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

export const InvoiceTable = ({
  invoices,
  isLoading,
  downloadingId,
  onDownload,
}: InvoiceTableProps) => {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
          <tr>
            <th className="px-5 py-4">Invoice</th>
            <th className="px-5 py-4">Penyewa</th>
            <th className="px-5 py-4">Kamar</th>
            <th className="px-5 py-4">Tanggal Bayar</th>
            <th className="px-5 py-4">Jumlah</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            <tr>
              <td
                className="px-5 py-8 text-center font-medium text-dark/50"
                colSpan={7}
              >
                Memuat data...
              </td>
            </tr>
          ) : invoices.length === 0 ? (
            <tr>
              <td
                className="px-5 py-8 text-center font-medium text-dark/50"
                colSpan={7}
              >
                Tidak ada invoice.
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr
                key={invoice.id_pembayaran}
                className="transition-colors hover:bg-light/70"
              >
                <td className="px-5 py-4">
                  <p className="font-black text-dark">
                    {invoice.kode_invoice || "-"}
                  </p>
                  <p className="text-xs font-medium capitalize text-dark/40">
                    {invoice.metode_pembayaran || "-"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-bold text-dark">
                    {invoice.penyewa.nama_lengkap || "-"}
                  </p>
                  <p className="text-xs font-medium text-dark/40">
                    {invoice.penyewa.email || "-"}
                  </p>
                </td>

                <td className="px-5 py-4 font-medium text-dark/70">
                  {invoice.kamar.nomor_kamar || "-"}
                </td>

                <td className="px-5 py-4 font-medium text-dark/70">
                  {formatDate(invoice.tanggal_bayar)}
                </td>

                <td className="px-5 py-4 font-black text-success">
                  {formatRupiah(invoice.jumlah_bayar)}
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-[10px] font-black uppercase text-success">
                    <CheckCircle size={13} />
                    Diterima
                  </span>
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onDownload(invoice)}
                    disabled={downloadingId === invoice.id_pembayaran}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-black text-white transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download size={14} />
                    {downloadingId === invoice.id_pembayaran
                      ? "..."
                      : "PDF"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
