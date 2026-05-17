import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../../api/admin";
import type { PenghuniItem } from "../../types";

type StatusFilter = "aktif" | "selesai" | "all";

const formatRupiah = (value: string | number) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

const AdminPenghuni = () => {
  const [status, setStatus] = useState<StatusFilter>("aktif");
  const [penghuni, setPenghuni] = useState<PenghuniItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Penghuni</h1>
          <p className="text-sm text-gray-500">
            Kelola penghuni aktif dan arsip alumni berdasarkan riwayat sewa.
          </p>
        </div>

        <Link
          to="/admin/penghuni/tambah"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 text-centerXSSSS max-w-42"
        >
          + Tambah Penghuni
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatus("aktif")}
            className={`rounded-lg px-4 py-2 text-sm ${status === "aktif"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Penghuni Aktif
          </button>

          <button
            onClick={() => setStatus("selesai")}
            className={`rounded-lg px-4 py-2 text-sm ${status === "selesai"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Alumni
          </button>

          <button
            onClick={() => setStatus("all")}
            className={`rounded-lg px-4 py-2 text-sm ${status === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Semua Riwayat
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Kontak</th>
                  <th className="px-4 py-3">Kamar</th>
                  <th className="px-4 py-3">Tanggal Masuk</th>
                  <th className="px-4 py-3">Tanggal Keluar</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
                      Memuat data...
                    </td>
                  </tr>
                ) : penghuni.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
                      Tidak ada data penghuni.
                    </td>
                  </tr>
                ) : (
                  penghuni.map((item) => (
                    <tr key={item.id_sewa} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {item.user?.nama_lengkap || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.user?.email || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p>{item.user?.no_hp || "-"}</p>
                        <p className="text-xs text-gray-500">
                          {item.user?.alamat_asal || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-medium">
                          {item.kamar?.nomor_kamar || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.kamar?.luas_kamar || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-3">{item.tanggal_masuk}</td>
                      <td className="px-4 py-3">{item.tanggal_keluar || "-"}</td>
                      <td className="px-4 py-3">{formatRupiah(item.harga_deal)}</td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${item.status_sewa === "aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {item.status_sewa}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {item.status_sewa === "aktif" ? (
                          <button
                            onClick={() => handleSelesaikan(item.id_sewa)}
                            className="rounded-lg border border-orange-200 px-3 py-1 text-xs text-orange-700 hover:bg-orange-50"
                          >
                            Arsipkan
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
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
    </div>
  );
};

export default AdminPenghuni;