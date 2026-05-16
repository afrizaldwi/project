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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const summary = data?.summary;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
          <p className="text-sm text-gray-500">
            Catat pengeluaran operasional dan hitung laba bersih kost.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={bulan}
            onChange={(event) => setBulan(Number(event.target.value))}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={tahun}
            onChange={(event) => setTahun(Number(event.target.value))}
            className="w-28 rounded-lg border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pemasukan</p>
          <p className="mt-2 text-xl font-bold text-green-600">
            {formatRupiah(summary?.total_pemasukan ?? 0)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pengeluaran</p>
          <p className="mt-2 text-xl font-bold text-red-600">
            {formatRupiah(summary?.total_pengeluaran ?? 0)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Laba Bersih</p>
          <p className="mt-2 text-xl font-bold text-blue-600">
            {formatRupiah(summary?.laba_bersih ?? 0)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tagihan Belum Bayar</p>
          <p className="mt-2 text-xl font-bold text-orange-600">
            {formatRupiah(summary?.tagihan_belum_bayar ?? 0)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border bg-white p-5 shadow-sm lg:col-span-1"
        >
          <div>
            <h2 className="text-lg font-bold text-gray-800">Catat Pengeluaran</h2>
            <p className="text-sm text-gray-500">Masukkan biaya operasional kost.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Judul Pengeluaran
            </label>
            <input
              value={form.judul_pengeluaran}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  judul_pengeluaran: event.target.value,
                }))
              }
              required
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Jumlah
            </label>
            <input
              type="number"
              min={0}
              value={form.jumlah_pengeluaran}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  jumlah_pengeluaran: event.target.value,
                }))
              }
              required
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tanggal
            </label>
            <input
              type="date"
              value={form.tanggal_pengeluaran}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  tanggal_pengeluaran: event.target.value,
                }))
              }
              required
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea
              value={form.deskripsi}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  deskripsi: event.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Pengeluaran"}
          </button>
        </form>

        <div className="rounded-xl border bg-white shadow-sm lg:col-span-2">
          <div className="border-b p-5">
            <h2 className="text-lg font-bold text-gray-800">Daftar Pengeluaran</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Jumlah</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                      Memuat data...
                    </td>
                  </tr>
                ) : pengeluaran.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                      Belum ada pengeluaran pada periode ini.
                    </td>
                  </tr>
                ) : (
                  pengeluaran.map((item) => (
                    <tr key={item.id_pengeluaran} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {item.judul_pengeluaran}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.deskripsi || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-3">{item.tanggal_pengeluaran}</td>
                      <td className="px-4 py-3">
                        {formatRupiah(item.jumlah_pengeluaran)}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(item.id_pengeluaran)}
                          className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
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
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-bold text-gray-800">Pembayaran Terbaru</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Penghuni</th>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Tanggal Bayar</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data?.pembayaran_terbaru.length ? (
                data.pembayaran_terbaru.map((item) => (
                  <tr key={item.id_pembayaran} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.nama_lengkap || "-"}</td>
                    <td className="px-4 py-3">{item.kode_invoice || "-"}</td>
                    <td className="px-4 py-3">{item.tanggal_bayar}</td>
                    <td className="px-4 py-3">
                      {formatRupiah(item.jumlah_bayar)}
                    </td>
                    <td className="px-4 py-3">{item.status_verifikasi}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                    Belum ada pembayaran pada periode ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLaporanKeuangan;