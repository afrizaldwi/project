import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  FileText,
  Lock,
  Plus,
  Receipt,
} from "lucide-react";

import { invoiceApi } from "../../api/invoice";
import type { InvoiceItem } from "../../types";

const formatRupiah = (value: string | number | null | undefined) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Laporan Keuangan</h1>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Export laporan transaksi pembayaran yang sudah diterima admin.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled
            title="Filter periode akan mengikuti fitur laporan keuangan Ima."
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-black text-dark/30"
          >
            <CalendarDays size={16} />
            Filter Periode
          </button>

          <button
            type="button"
            disabled
            title="Catat pengeluaran adalah bagian fitur Ima."
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-black text-dark/30"
          >
            <Plus size={16} />
            Catat Pengeluaran
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isLoading || invoices.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
            <Receipt size={20} />
          </div>

          <p className="text-2xl font-black text-dark">
            {isLoading ? "-" : summary.totalInvoice}
          </p>
          <p className="text-sm font-bold text-dark/40">Total Invoice</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-success/10 p-2 text-success">
            <FileText size={20} />
          </div>

          <p className="text-2xl font-black text-dark">
            {isLoading ? "-" : formatRupiah(summary.totalPembayaran)}
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

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-dark">
              Export Laporan Transaksi
            </h2>
            <p className="mt-1 text-sm font-medium text-dark/50">
              Branch Salsa hanya menambahkan output laporan berupa CSV dari
              pembayaran yang sudah diterima. Tampilan tabel, filter periode,
              dan pencatatan pengeluaran akan digabung setelah branch Ima masuk
              ke develop.
            </p>
          </div>

          <div className="rounded-xl bg-light px-4 py-3 text-sm font-black text-dark/50">
            {isLoading
              ? "Memuat data..."
              : `${invoices.length} transaksi siap diexport`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLaporanKeuangan;