import { type FormEvent, useEffect, useMemo, useState } from "react";

import adminApi from "../../api/admin";
import type { LaporanKeuanganResponse, PengeluaranItem } from "../../types";
import LaporanHeader from "../../components/admin/LaporanHeader";
import LaporanSummaryCards from "../../components/admin/LaporanSummaryCards";
import FormPengeluaran from "../../components/admin/FormPengeluaran";
import TabelPengeluaran from "../../components/admin/TabelPengeluaran";
import TabelPembayaran from "../../components/admin/TabelPembayaran";

const formatRupiah = (value: string | number) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

const AdminLaporanKeuangan = () => {
  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [data, setData] = useState<LaporanKeuanganResponse | null>(null);
  const [pengeluaran, setPengeluaran] = useState<PengeluaranItem[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentYear = now.getFullYear();

  const yearOptions = useMemo(
    () => Array.from({ length: 6 }, (_, index) => currentYear - index),
    [currentYear]
  );

  const monthOptions = useMemo(
    () => [
      { value: 1, label: "Januari" },
      { value: 2, label: "Februari" },
      { value: 3, label: "Maret" },
      { value: 4, label: "April" },
      { value: 5, label: "Mei" },
      { value: 6, label: "Juni" },
      { value: 7, label: "Juli" },
      { value: 8, label: "Agustus" },
      { value: 9, label: "September" },
      { value: 10, label: "Oktober" },
      { value: 11, label: "November" },
      { value: 12, label: "Desember" },
    ],
    []
  );

  const [form, setForm] = useState({
    judul_pengeluaran: "",
    deskripsi: "",
    jumlah_pengeluaran: "",
    tanggal_pengeluaran: new Date().toISOString().slice(0, 10),
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [laporanData, pengeluaranData] = await Promise.all([
        adminApi.getLaporanKeuangan(bulan, tahun),
        adminApi.getPengeluaran(bulan, tahun),
      ]);

      setData(laporanData);
      setPengeluaran(pengeluaranData);
    } catch {
      setErrorMessage("Gagal memuat laporan keuangan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bulan, tahun]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin mencatat pengeluaran berikut?\n\nJudul: ${form.judul_pengeluaran}\nJumlah: ${formatRupiah(form.jumlah_pengeluaran)}`
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await adminApi.createPengeluaran({
        judul_pengeluaran: form.judul_pengeluaran,
        deskripsi: form.deskripsi || undefined,
        jumlah_pengeluaran: Number(form.jumlah_pengeluaran),
        tanggal_pengeluaran: form.tanggal_pengeluaran,
      });

      setForm({
        judul_pengeluaran: "",
        deskripsi: "",
        jumlah_pengeluaran: "",
        tanggal_pengeluaran: new Date().toISOString().slice(0, 10),
      });

      setShowExpenseForm(false);
      await fetchData();
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0] as string[];
        setErrorMessage(firstError?.[0] || "Validasi gagal.");
      } else {
        setErrorMessage(
          error?.response?.data?.message || "Gagal mencatat pengeluaran."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (idPengeluaran: number) => {
    const confirmed = window.confirm("Hapus pengeluaran ini?");
    if (!confirmed) return;

    try {
      await adminApi.deletePengeluaran(idPengeluaran);
      await fetchData();
    } catch {
      alert("Gagal menghapus pengeluaran.");
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const blob = await adminApi.exportLaporanKeuanganCsv(bulan, tahun);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.download = `laporan-keuangan-${bulan}-${tahun}.csv`;
      link.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage("Gagal mengunduh CSV.");
    } finally {
      setIsLoading(false);
    }
  };

  const summary = data?.summary;

  return (
    <div className="space-y-6 bg-light p-4 md:p-6">
      <LaporanHeader
        bulan={bulan}
        tahun={tahun}
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        setBulan={setBulan}
        setTahun={setTahun}
        onToggleForm={() => setShowExpenseForm((prev) => !prev)}
        onExportCsv={handleExportCsv}
      />

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <LaporanSummaryCards summary={summary} formatRupiah={formatRupiah} />

      {
        showExpenseForm && (
          <FormPengeluaran
            form={form}
            setForm={setForm}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => setShowExpenseForm(false)}
          />
        )
      }

      <div className="grid gap-6 lg:grid-cols-2">
        <TabelPengeluaran
          isLoading={isLoading}
          pengeluaran={pengeluaran}
          tagihanBelumBayar={summary?.tagihan_belum_bayar ?? 0}
          formatRupiah={formatRupiah}
          onDelete={handleDelete}
        />

        <TabelPembayaran
          pembayaran={data?.pembayaran_terbaru}
          formatRupiah={formatRupiah}
        />
      </div>
    </div >
  );
};

export default AdminLaporanKeuangan;