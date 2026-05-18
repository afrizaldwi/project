import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Download,
  Receipt,
  Search,
} from "lucide-react";

import { downloadPdfBlob, invoiceApi } from "../../api/invoice";
import type { InvoiceItem } from "../../types";

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

const AdminTagihan = () => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredInvoices = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return invoices;

    return invoices.filter((invoice) => {
      return (
        invoice.kode_invoice?.toLowerCase().includes(keyword) ||
        invoice.penyewa.nama_lengkap?.toLowerCase().includes(keyword) ||
        invoice.kamar.nomor_kamar?.toLowerCase().includes(keyword) ||
        invoice.metode_pembayaran?.toLowerCase().includes(keyword)
      );
    });
  }, [invoices, search]);

  const summary = useMemo(() => {
    return {
      totalInvoice: invoices.length,
      totalPembayaran: invoices.reduce((total, invoice) => {
        return total + Number(invoice.jumlah_bayar || 0);
      }, 0),
    };
  }, [invoices]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await invoiceApi.getAdminInvoices();
      setInvoices(data);
    } catch {
      setErrorMessage("Gagal memuat data invoice.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadPdf = async (invoice: InvoiceItem) => {
    try {
      setDownloadingId(invoice.id_pembayaran);

      const blob = await invoiceApi.downloadAdminInvoicePdf(invoice.id_pembayaran);

      downloadPdfBlob(blob, `${invoice.kode_invoice || "invoice"}.pdf`);
    } catch {
      alert("Gagal download invoice PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 bg-light p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Manajemen Tagihan</h1>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Kelola invoice pembayaran yang sudah diterima admin.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
            <Receipt size={20} />
          </div>

          <p className="text-2xl font-black text-dark">
            {summary.totalInvoice}
          </p>
          <p className="text-sm font-bold text-dark/40">Total Invoice</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-success/10 p-2 text-success">
            <CheckCircle size={20} />
          </div>

          <p className="text-2xl font-black text-dark">
            {formatRupiah(summary.totalPembayaran)}
          </p>
          <p className="text-sm font-bold text-dark/40">
            Total Pembayaran Diterima
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-dark">Invoice Transaksi</h2>
            <p className="text-sm font-medium text-dark/40">
              Data berasal dari pembayaran dengan status diterima.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari invoice, penyewa, kamar..."
              className="w-full rounded-xl border border-gray-200 bg-light py-2 pl-9 pr-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

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
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-8 text-center font-medium text-dark/50"
                    colSpan={7}
                  >
                    Tidak ada invoice.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
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
                        onClick={() => handleDownloadPdf(invoice)}
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

        <div className="space-y-3 p-4 md:hidden">
          {isLoading ? (
            <div className="rounded-xl bg-light p-5 text-center text-sm font-semibold text-dark/50">
              Memuat data...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="rounded-xl bg-light p-5 text-center text-sm font-semibold text-dark/50">
              Tidak ada invoice.
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
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
                  onClick={() => handleDownloadPdf(invoice)}
                  disabled={downloadingId === invoice.id_pembayaran}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-black text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download size={14} />
                  {downloadingId === invoice.id_pembayaran
                    ? "Memproses..."
                    : "Download PDF"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTagihan;