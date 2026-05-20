import { useEffect, useMemo, useState } from "react";

import { invoiceApi } from "../../api/invoice";
import type { InvoiceItem } from "../../types";
import { LaporanKeuanganHeader } from "../../components/laporankeuangan/LaporanKeuanganHeader";
import { LaporanKeuanganSummary } from "../../components/laporankeuangan/LaporanKeuanganSummary";
import { LaporanKeuanganExportCard } from "../../components/laporankeuangan/LaporanKeuanganExportCard";

const escapeCsvCell = (value: string | number | null | undefined) => {
  const stringValue = String(value ?? "-");
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const AdminLaporanKeuangan = () => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const summary = useMemo(() => {
    const totalPembayaran = invoices.reduce((total, invoice) => {
      return total + Number(invoice.jumlah_bayar || 0);
    }, 0);

    return {
      totalInvoice: invoices.length,
      totalPembayaran,
    };
  }, [invoices]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await invoiceApi.getAdminInvoices();
      setInvoices(data);
    } catch {
      setErrorMessage("Gagal memuat data laporan transaksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleExportCsv = () => {
    if (invoices.length === 0) {
      alert("Tidak ada data transaksi untuk diexport.");
      return;
    }

    const headers = [
      "Kode Invoice",
      "Nama Penyewa",
      "Email Penyewa",
      "No HP",
      "Nomor Kamar",
      "Tanggal Tagihan",
      "Jatuh Tempo",
      "Tanggal Bayar",
      "Metode Pembayaran",
      "Jumlah Bayar",
      "Status Pembayaran",
    ];

    const rows = invoices.map((invoice) => [
      invoice.kode_invoice || "-",
      invoice.penyewa.nama_lengkap || "-",
      invoice.penyewa.email || "-",
      invoice.penyewa.no_hp || "-",
      invoice.kamar.nomor_kamar || "-",
      invoice.tanggal_tagihan || "-",
      invoice.tanggal_jatuh_tempo || "-",
      invoice.tanggal_bayar || "-",
      invoice.metode_pembayaran || "-",
      invoice.jumlah_bayar || 0,
      "Diterima",
    ]);

    const csvContent = [
      ["Laporan Transaksi Pembayaran Kost"].map(escapeCsvCell).join(","),
      [],
      ["Ringkasan"].map(escapeCsvCell).join(","),
      ["Total Invoice", summary.totalInvoice].map(escapeCsvCell).join(","),
      ["Total Pembayaran Diterima", summary.totalPembayaran]
        .map(escapeCsvCell)
        .join(","),
      [],
      headers.map(escapeCsvCell).join(","),
      ...rows.map((row) => row.map(escapeCsvCell).join(",")),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `laporan-transaksi-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 bg-light p-4 md:p-6">
      <LaporanKeuanganHeader
        isLoading={isLoading}
        hasInvoices={invoices.length > 0}
        onExportCsv={handleExportCsv}
      />

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <LaporanKeuanganSummary
        isLoading={isLoading}
        totalInvoice={summary.totalInvoice}
        totalPembayaran={summary.totalPembayaran}
      />

      <LaporanKeuanganExportCard
        isLoading={isLoading}
        invoiceCount={invoices.length}
      />
    </div>
  );
};

export default AdminLaporanKeuangan;