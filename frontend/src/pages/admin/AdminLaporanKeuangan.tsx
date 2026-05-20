import { type FormEvent, useEffect, useMemo, useState } from "react";

import adminApi from "../../api/admin";
import type { LaporanKeuanganResponse, PengeluaranItem } from "../../types";

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

  const yearOptions = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => currentYear - index);
  }, [currentYear]);

  const [form, setForm] = useState({
    judul_pengeluaran: "",
    deskripsi: "",
    jumlah_pengeluaran: "",
    tanggal_pengeluaran: new Date().toISOString().slice(0, 10),
  });

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
        setErrorMessage(error?.response?.data?.message || "Gagal mencatat pengeluaran.");
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

  const handleExportCsv = () => {
    const pemasukanRows =
      data?.pembayaran_terbaru.map((item) => ({
        tipe: "Pemasukan",
        tanggal: item.tanggal_bayar,
        keterangan: `${item.nama_lengkap || "-"} / ${item.kode_invoice || "-"}`,
        jumlah: item.jumlah_bayar,
        status: item.status_verifikasi,
      })) || [];

    const pengeluaranRows = pengeluaran.map((item) => ({
      tipe: "Pengeluaran",
      tanggal: item.tanggal_pengeluaran,
      keterangan: item.judul_pengeluaran,
      jumlah: item.jumlah_pengeluaran,
      status: item.deskripsi || "-",
    }));

    const rows = [
      ["Tipe", "Tanggal", "Keterangan", "Jumlah", "Status/Keterangan"],
      ...pemasukanRows.map((row) => [
        row.tipe,
        row.tanggal,
        row.keterangan,
        row.jumlah,
        row.status,
      ]),
      ...pengeluaranRows.map((row) => [
        row.tipe,
        row.tanggal,
        row.keterangan,
        row.jumlah,
        row.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `laporan-keuangan-${bulan}-${tahun}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const summary = data?.summary;

  return (
    <div className="space-y-6 bg-light p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Laporan Keuangan</h1>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Ringkasan transaksi dan pencatatan pengeluaran operasional.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={bulan}
            onChange={(event) => setBulan(Number(event.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={tahun}
            onChange={(event) => setTahun(Number(event.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-28"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowExpenseForm((previous) => !previous)}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent"
          >
            + Catat Pengeluaran
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-black text-dark/60 transition-all hover:border-primary/30 hover:text-primary"
          >
            Cetak CSV
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-dark/40">Total Pemasukan</p>
          <p className="mt-3 text-2xl font-black text-success">
            {formatRupiah(summary?.total_pemasukan ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-dark/40">Total Pengeluaran</p>
          <p className="mt-3 text-2xl font-black text-danger">
            {formatRupiah(summary?.total_pengeluaran ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-dark/40">Saldo Bersih</p>
          <p className="mt-3 text-2xl font-black text-primary">
            {formatRupiah(summary?.laba_bersih ?? 0)}
          </p>
        </div>
      </div>

      {/* Catatan Pengeluaran Baru */}
      {showExpenseForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-black text-dark">
            + Catatan Pengeluaran Baru
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-bold text-dark/70">
                Tanggal
              </label>
              <input
                type="date"
                value={form.tanggal_pengeluaran}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    tanggal_pengeluaran: event.target.value,
                  }))
                }
                required
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-dark/70">
                Keterangan
              </label>
              <input
                value={form.judul_pengeluaran}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    judul_pengeluaran: event.target.value,
                  }))
                }
                required
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-dark/70">
                Jumlah
              </label>
              <input
                type="number"
                min={1}
                value={form.jumlah_pengeluaran}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    jumlah_pengeluaran: event.target.value,
                  }))
                }
                required
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-bold text-dark/70">
              Deskripsi
            </label>
            <textarea
              value={form.deskripsi}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  deskripsi: event.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowExpenseForm(false)}
              className="px-6 py-2.5 text-sm font-black text-dark/40 transition-colors hover:text-dark"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-black text-dark">Daftar Pengeluaran</h2>
            <p className="text-sm font-medium text-dark/40">
              Total tagihan belum bayar:{" "}
              <span className="font-black text-warning">
                {formatRupiah(summary?.tagihan_belum_bayar ?? 0)}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
                <tr>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4">Keterangan</th>
                  <th className="px-5 py-4">Jumlah</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={4}>
                      Memuat data...
                    </td>
                  </tr>
                ) : pengeluaran.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={4}>
                      Belum ada pengeluaran pada periode ini.
                    </td>
                  </tr>
                ) : (
                  pengeluaran.map((item) => (
                    <tr key={item.id_pengeluaran} className="transition-colors hover:bg-light/70">
                      <td className="px-5 py-4 font-medium text-dark/70">
                        {item.tanggal_pengeluaran}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-black text-dark">{item.judul_pengeluaran}</p>
                        <p className="text-xs font-medium text-dark/40">
                          {item.deskripsi || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-black text-danger">
                        {formatRupiah(item.jumlah_pengeluaran)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id_pengeluaran)}
                          className="text-xs font-black text-danger underline underline-offset-4 transition-colors hover:text-danger/80"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-black text-dark">Pembayaran Terbaru</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
                <tr>
                  <th className="px-5 py-4">Penghuni</th>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4">Jumlah</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data?.pembayaran_terbaru.length ? (
                  data.pembayaran_terbaru.map((item) => (
                    <tr key={item.id_pembayaran} className="transition-colors hover:bg-light/70">
                      <td className="px-5 py-4">
                        <p className="font-black text-dark">{item.nama_lengkap || "-"}</p>
                        <p className="text-xs font-medium text-dark/40">
                          {item.kode_invoice || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-dark/70">
                        {item.tanggal_bayar}
                      </td>

                      <td className="px-5 py-4 font-black text-success">
                        {formatRupiah(item.jumlah_bayar)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-success/10 px-3 py-1 text-[10px] font-black uppercase text-success">
                          {item.status_verifikasi}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={4}>
                      Belum ada pembayaran pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLaporanKeuangan;