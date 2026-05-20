import { useEffect, useMemo, useState } from "react";

import { downloadPdfBlob, invoiceApi } from "../../api/invoice";
import type { InvoiceItem } from "../../types";
import { PenyewaInvoiceSummary } from "../../components/invoice/PenyewaInvoiceSummary";
import { PenyewaInvoiceList } from "../../components/invoice/PenyewaInvoiceList";

const PenyewaTagihan = () => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const totalPaid = useMemo(() => {
    return invoices.reduce((total, invoice) => {
      return total + Number(invoice.jumlah_bayar || 0);
    }, 0);
  }, [invoices]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await invoiceApi.getPenyewaInvoices();
      setInvoices(data);
    } catch {
      setErrorMessage("Gagal memuat data tagihan.");
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

      const blob = await invoiceApi.downloadPenyewaInvoicePdf(
        invoice.id_pembayaran
      );

      downloadPdfBlob(blob, `${invoice.kode_invoice || "invoice"}.pdf`);
    } catch {
      alert("Gagal download invoice PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 bg-light p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-black text-dark">Tagihan Saya</h1>
        <p className="mt-1 text-sm font-medium text-dark/50">
          Lihat riwayat pembayaran dan download invoice pembayaran kost.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <PenyewaInvoiceSummary
        totalInvoice={invoices.length}
        totalPaid={totalPaid}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-dark">Riwayat Pembayaran</h2>
          <p className="text-sm font-medium text-dark/40">
            Invoice tersedia setelah pembayaran diterima admin.
          </p>
        </div>

        <PenyewaInvoiceList
          invoices={invoices}
          isLoading={isLoading}
          downloadingId={downloadingId}
          onDownload={handleDownloadPdf}
        />
      </section>
    </div>
  );
};

export default PenyewaTagihan;