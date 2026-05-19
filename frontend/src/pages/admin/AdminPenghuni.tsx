import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import adminApi from "../../api/admin";
import type { PenghuniItem } from "../../types";

type StatusFilter = "aktif" | "selesai";

const AdminPenghuni = () => {
  const [status, setStatus] = useState<StatusFilter>("aktif");
  const [search, setSearch] = useState("");
  const [penghuni, setPenghuni] = useState<PenghuniItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate()

  const fetchPenghuni = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await adminApi.getPenghuni(status);
      setPenghuni(data);
    } catch {
      setErrorMessage("Gagal memuat data penghuni.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenghuni();
  }, [status]);

  const filteredPenghuni = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return penghuni;

    return penghuni.filter((item) => {
      const nama = item.user?.nama_lengkap?.toLowerCase() || "";
      const email = item.user?.email?.toLowerCase() || "";
      const kamar = item.kamar?.nomor_kamar?.toLowerCase() || "";

      return nama.includes(keyword) || email.includes(keyword) || kamar.includes(keyword);
    });
  }, [penghuni, search]);

  const handleSelesaikan = async (idSewa: number) => {
    const confirmed = window.confirm(
      "Arsipkan penghuni ini sebagai alumni? Status kamar akan diubah menjadi tersedia."
    );

    if (!confirmed) return;

    try {
      await adminApi.finishSewa(idSewa, new Date().toISOString().slice(0, 10));
      await fetchPenghuni();
    } catch {
      alert("Gagal mengarsipkan penghuni.");
    }
  };

  return (
    <div className="space-y-6 bg-light p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Data Penghuni</h1>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Kelola data penghuni Kost Bahagia
          </p>
        </div>

        <Link
          to="/admin/penghuni/tambah"
          className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-accent"
        >
          + Tambah Penghuni
        </Link>
      </div>

      {/* Tabs and Search */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full rounded-xl bg-light p-1 md:w-auto">
            <button
              type="button"
              onClick={() => setStatus("aktif")}
              className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${status === "aktif"
                ? "bg-primary text-white shadow-sm"
                : "text-dark/40 hover:text-dark"
                }`}
            >
              Penghuni Aktif
            </button>

            <button
              type="button"
              onClick={() => setStatus("selesai")}
              className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${status === "selesai"
                ? "bg-primary text-white shadow-sm"
                : "text-dark/40 hover:text-dark"
                }`}
            >
              Riwayat / Alumni
            </button>
          </div>

          <input
            type="text"
            placeholder="Cari nama penghuni atau kamar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-light px-4 py-2 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 md:max-w-xs"
          />
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <div className="space-y-3 md:hidden">
        {isLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm font-semibold text-dark/50 shadow-sm">
            Memuat data...
          </div>
        ) : filteredPenghuni.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm font-semibold text-dark/50 shadow-sm">
            Tidak ada data.
          </div>
        ) : (
          filteredPenghuni.map((item) => (
            <div
              key={item.id_sewa}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-dark">
                    {item.user?.nama_lengkap || "-"}
                  </h3>
                  <p className="truncate text-xs font-medium text-dark/40">
                    {item.user?.email || "-"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase ${item.status_sewa === "aktif"
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                    }`}
                >
                  {item.status_sewa === "aktif" ? "Aktif" : "Non Aktif"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-light p-3 text-xs">
                <div>
                  <p className="font-bold text-dark/40">Kamar</p>
                  <p className="mt-1 font-black text-dark">
                    {item.kamar?.nomor_kamar || "-"}
                  </p>
                  <p className="font-medium text-dark/40">
                    {item.kamar?.luas_kamar || "-"}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-dark/40">Tanggal Masuk</p>
                  <p className="mt-1 font-black text-dark">{item.tanggal_masuk}</p>
                </div>

                <div>
                  <p className="font-bold text-dark/40">Tanggal Keluar</p>
                  <p className="mt-1 font-black text-dark">
                    {item.tanggal_keluar || "-"}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-dark/40">Aksi</p>
                  {item.status_sewa === "aktif" ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/penghuni/perpanjang/${item.id_sewa}`)
                        }
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Perpanjang
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelesaikan(item.id_sewa)}
                        className="text-xs font-black text-danger underline underline-offset-4 transition-colors hover:text-danger/80"
                      >
                        Arsipkan
                      </button>
                    </div>
                  ) : (
                    <span className="mt-1 block text-xs font-bold text-dark/30">-</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
              <tr>
                <th className="px-5 py-4">Nama</th>
                <th className="px-5 py-4">Kamar</th>
                <th className="px-5 py-4">Tgl Masuk</th>
                <th className="px-5 py-4">Tgl Keluar</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={6}>
                    Memuat data...
                  </td>
                </tr>
              ) : filteredPenghuni.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={6}>
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredPenghuni.map((item) => (
                  <tr key={item.id_sewa} className="transition-colors hover:bg-light/70">
                    <td className="px-5 py-4">
                      <p className="font-black text-dark">
                        {item.user?.nama_lengkap || "-"}
                      </p>
                      <p className="text-xs font-medium text-dark/40">
                        {item.user?.email || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-dark">
                        {item.kamar?.nomor_kamar || "-"}
                      </p>
                      <p className="text-xs font-medium text-dark/40">
                        {item.kamar?.luas_kamar || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-medium text-dark/70">
                      {item.tanggal_masuk}
                    </td>

                    <td className="px-5 py-4 font-medium text-dark/70">
                      {item.tanggal_keluar || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${item.status_sewa === "aktif"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                          }`}
                      >
                        {item.status_sewa === "aktif" ? "Aktif" : "Non Aktif"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {item.status_sewa === "aktif" ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/penghuni/perpanjang/${item.id_sewa}`)}
                            className="text-xs font-black text-primary underline underline-offset-4 transition-colors hover:text-accent"
                          >
                            Perpanjang
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelesaikan(item.id_sewa)}
                            className="text-xs font-black text-danger underline underline-offset-4 transition-colors hover:text-danger/80"
                          >
                            Arsipkan
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-dark/30">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPenghuni;