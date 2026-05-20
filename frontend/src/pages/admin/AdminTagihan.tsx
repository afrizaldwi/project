import { useEffect, useMemo, useState } from "react";

import { downloadPdfBlob, invoiceApi } from "../../api/invoice";
import type { InvoiceItem } from "../../types";
import { InvoiceSummary } from "../../components/invoice/InvoiceSummary";
import { InvoiceSearch } from "../../components/invoice/InvoiceSearch";
import { InvoiceTable } from "../../components/invoice/InvoiceTable";
import { InvoiceMobileList } from "../../components/invoice/InvoiceMobileList";

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

      <InvoiceSummary
        totalInvoice={summary.totalInvoice}
        totalPembayaran={summary.totalPembayaran}
      />

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <InvoiceSearch search={search} onSearchChange={setSearch} />

        <InvoiceTable
          invoices={filteredInvoices}
          isLoading={isLoading}
          downloadingId={downloadingId}
          onDownload={handleDownloadPdf}
        />

        <InvoiceMobileList
          invoices={filteredInvoices}
          isLoading={isLoading}
          downloadingId={downloadingId}
          onDownload={handleDownloadPdf}
        />
      </div>
    </div>
  );
};

export default AdminTagihan;