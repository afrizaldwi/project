import { useEffect, useMemo, useState } from "react";
import keluhanService from "../../services/keluhanService";
import type { Keluhan, KeluhanStatus } from "../../types";

const statusOptions: Array<KeluhanStatus | "semua"> = [
  "semua",
  "pending",
  "proses",
  "selesai",
];

const statusLabel: Record<KeluhanStatus | "semua", string> = {
  semua: "Semua",
  pending: "Pending",
  proses: "Diproses",
  selesai: "Selesai",
};

const statusClass: Record<KeluhanStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  proses: "bg-blue-50 text-blue-700 border-blue-200",
  selesai: "bg-green-50 text-green-700 border-green-200",
};

const getStorageBaseUrl = () => {
  return (import.meta.env.VITE_STORAGE_URL || "http://localhost:8000").replace(/\/$/, "");
};

const getStorageUrl = (path?: string | null) => {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
      .replace("http://kost-nginx", getStorageBaseUrl())
      .replace("https://kost-nginx", getStorageBaseUrl())
      .replace("http://localhost/storage", `${getStorageBaseUrl()}/storage`);
  }

  return `${getStorageBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
};

const formatTanggal = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const AdminKeluhan = () => {
  const [data, setData] = useState<Keluhan[]>([]);
  const [statusFilter, setStatusFilter] = useState<KeluhanStatus | "semua">("semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const keluhan = await keluhanService.getAdminKeluhan(statusFilter);
      setData(keluhan);
    } catch {
      setError("Gagal memuat laporan kerusakan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((item) => {
      return (
        item.judul_keluhan.toLowerCase().includes(keyword) ||
        item.deskripsi_keluhan.toLowerCase().includes(keyword) ||
        item.nama_penghuni.toLowerCase().includes(keyword) ||
        item.nomor_kamar.toLowerCase().includes(keyword)
      );
    });
  }, [data, search]);

  const counts = useMemo(() => {
    return {
      total: data.length,
      pending: data.filter((item) => item.status_keluhan === "pending").length,
      proses: data.filter((item) => item.status_keluhan === "proses").length,
      selesai: data.filter((item) => item.status_keluhan === "selesai").length,
    };
  }, [data]);

  const handleUpdateStatus = async (id: number, status: KeluhanStatus) => {
    setIsUpdatingId(id);
    setError(null);

    try {
      const updated = await keluhanService.updateStatus(id, status);

      setData((current) =>
        current.map((item) => (item.id_keluhan === id ? updated : item))
      );
    } catch {
      setError("Gagal memperbarui status keluhan.");
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus laporan kerusakan ini?")) return;

    setError(null);

    try {
      await keluhanService.deleteKeluhan(id);
      setData((current) => current.filter((item) => item.id_keluhan !== id));
    } catch {
      setError("Gagal menghapus laporan kerusakan.");
    }
  };

  return (
    <main className="space-y-6 p-6">
      <section className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 p-6 text-white shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
            Laporan Kerusakan
          </p>
          <h1 className="mt-2 text-2xl font-bold">Kelola Keluhan Penghuni</h1>
          <p className="mt-1 max-w-2xl text-sm text-blue-100">
            Pantau laporan kerusakan, ubah status perbaikan, dan hapus laporan yang tidak valid.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total" value={counts.total.toString()} />
        <StatCard label="Pending" value={counts.pending.toString()} />
        <StatCard label="Diproses" value={counts.proses.toString()} />
        <StatCard label="Selesai" value={counts.selesai.toString()} />
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Daftar Laporan</h2>
            <p className="text-sm text-gray-500">
              Status laporan dapat diubah oleh admin.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul, penghuni, kamar..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-72"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as KeluhanStatus | "semua")
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Memuat laporan kerusakan...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Belum ada laporan kerusakan.
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <TableHead>Laporan</TableHead>
                  <TableHead>Penghuni</TableHead>
                  <TableHead>Kamar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Lapor</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead>Aksi</TableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredData.map((item) => (
                  <tr key={item.id_keluhan} className="align-top hover:bg-gray-50">
                    <TableCell>
                      <p className="font-semibold text-gray-900">{item.judul_keluhan}</p>
                      <p className="mt-1 max-w-xs text-xs text-gray-500">
                        {item.deskripsi_keluhan}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="font-semibold text-gray-900">{item.nama_penghuni}</p>
                      <p className="text-xs text-gray-500">{item.email_penghuni}</p>
                    </TableCell>

                    <TableCell>{item.nomor_kamar}</TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[item.status_keluhan]
                          }`}
                      >
                        {statusLabel[item.status_keluhan]}
                      </span>
                    </TableCell>

                    <TableCell>{formatTanggal(item.tanggal_lapor)}</TableCell>

                    <TableCell>
                      {item.foto_kerusakan ? (
                        <div className="flex flex-col gap-1.5 min-w-[90px]">
                          {item.foto_kerusakan.split(",").map((path, idx) => {
                            const url = getStorageUrl("/storage/" + path.trim());
                            return url ? (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActivePreviewImage(url)}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors whitespace-nowrap text-center"
                              >
                                Foto {idx + 1}
                              </button>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Tidak ada</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <select
                          value={item.status_keluhan}
                          disabled={isUpdatingId === item.id_keluhan}
                          onChange={(event) =>
                            handleUpdateStatus(
                              item.id_keluhan,
                              event.target.value as KeluhanStatus
                            )
                          }
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="pending">Pending</option>
                          <option value="proses">Diproses</option>
                          <option value="selesai">Selesai</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id_keluhan)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {/* Image Preview Modal */}
      {activePreviewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setActivePreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActivePreviewImage(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white shadow-md hover:bg-black/75 transition-colors focus:outline-none z-10 text-xs font-bold"
              title="Tutup"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={activePreviewImage}
              alt="Preview Kerusakan"
              className="max-w-full max-h-[80vh] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
};

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

interface TableTextProps {
  children: React.ReactNode;
}

const TableHead = ({ children }: TableTextProps) => (
  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
    {children}
  </th>
);

const TableCell = ({ children }: TableTextProps) => (
  <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
);

export default AdminKeluhan;