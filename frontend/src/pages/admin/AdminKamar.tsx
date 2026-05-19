import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useKamar from "../../hook/useKamar";

const AdminKamar = () => {
  const navigate = useNavigate();
  const { kamarList, stats, isLoading, error, deleteKamar } = useKamar();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteTarget, setDeleteTarget] = useState<{
    id_kamar: number;
    nomor_kamar: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = kamarList.filter((k) => {
    const matchSearch = k.nomor_kamar.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "semua" || k.status_kamar === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteKamar(deleteTarget.id_kamar);
      setDeleteTarget(null);
    } catch (err: any) {
      setDeleteTarget(null);
      alert(err?.response?.data?.message || "Gagal menghapus kamar.");
    } finally {
      setIsDeleting(false);
    }
  };

  const parseFasilitas = (raw: string): string[] => {
    try {
      return JSON.parse(raw);
    } catch {
      return raw ? [raw] : [];
    }
  };

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-light p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Data Kamar</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola data kamar Kost Bahagia</p>
        </div>
        <button
          onClick={() => navigate("/admin/kamar/tambah")}
          className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + Tambah Kamar
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Kamar", value: stats.total, color: "text-dark" },
          { label: "Tersedia", value: stats.tersedia, color: "text-green-600" },
          { label: "Terisi", value: stats.terisi, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-5 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{isLoading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-5 items-center flex-wrap">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor kamar..."
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm bg-white text-dark outline-none focus:border-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-dark outline-none"
        >
          <option value="semua">Semua Status</option>
          <option value="tersedia">Tersedia</option>
          <option value="terisi">Terisi</option>
        </select>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 text-sm transition ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-400"}`}
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 text-sm transition ${viewMode === "list" ? "bg-primary text-white" : "bg-white text-gray-400"}`}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center flex-1 py-20">
          <p className="text-gray-400 text-sm">Memuat data kamar...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center flex-1 py-20">
          <p className="text-gray-400 text-sm">Tidak ada kamar yang ditemukan.</p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((kamar) => (
            <div key={kamar.id_kamar} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Foto */}
              <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                {kamar.foto_kamar ? (
                  <img
                    src={`http://localhost:8000/storage/${kamar.foto_kamar}`}
                    alt={`Kamar ${kamar.nomor_kamar}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-300">🛏</span>
                )}
                <span
                  className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${kamar.status_kamar === "tersedia"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                    }`}
                >
                  {kamar.status_kamar === "tersedia" ? "Tersedia" : "Terisi"}
                </span>
              </div>

              <div className="p-4">
                <p className="font-bold text-dark text-sm">No. {kamar.nomor_kamar}</p>
                <p className="text-sm font-bold text-primary mb-1">{formatRupiah(kamar.harga_bulanan)} / bulan</p>
                <p className="text-xs text-gray-500 mb-3">📐 {kamar.luas_kamar}</p>

                {/* Fasilitas */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {kamar.fasilitas.split(",").slice(0, 4).map((f) => (
                    <span key={f} className="text-xs bg-secondary text-primary border border-blue-100 px-2 py-0.5 rounded-full">
                      {f.trim()}
                    </span>
                  ))}
                  {kamar.fasilitas.split(",").length > 4 && (
                    <span className="text-xs text-gray-400">+{kamar.fasilitas.split(",").length - 4} lainnya</span>
                  )}
                </div>

                {/* Timestamp */}
                <p className="text-xs text-gray-300 mb-3">
                  Ditambahkan: {formatDate(kamar.created_at)}
                  {kamar.updated_at !== kamar.created_at && ` · Diedit: ${formatDate(kamar.updated_at)}`}
                </p>

                {/* Actions */}
                <div className="flex gap-2 border-t border-gray-50 pt-3">
                  <button
                    onClick={() => navigate(`/admin/kamar/edit/${kamar.id_kamar}`)}
                    className="flex-1 flex items-center justify-center gap-1 bg-secondary text-primary text-xs font-bold py-2 rounded-lg hover:opacity-80 transition"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(kamar)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-500 text-xs font-bold py-2 rounded-lg hover:opacity-80 transition"
                  >
                    🗑 Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Kamar</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Ukuran</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Fasilitas</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Harga</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((kamar) => (
                <tr key={kamar.id_kamar} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-bold text-dark">No. {kamar.nomor_kamar}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{kamar.luas_kamar}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{kamar.fasilitas}</td>
                  <td className="px-4 py-3 font-bold text-primary text-sm">{formatRupiah(kamar.harga_bulanan)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${kamar.status_kamar === "tersedia" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                      {kamar.status_kamar === "tersedia" ? "Tersedia" : "Terisi"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/admin/kamar/edit/${kamar.id_kamar}`)}
                        className="text-xs font-bold text-primary bg-secondary px-3 py-1.5 rounded-lg hover:opacity-80"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(kamar)}
                        className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:opacity-80"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">🗑</div>
              <div>
                <p className="font-bold text-dark text-sm">Hapus kamar ini?</p>
                <p className="text-xs text-gray-400">No. {deleteTarget.nomor_kamar}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Data kamar yang dihapus tidak dapat dikembalikan. Pastikan kamar ini tidak sedang dihuni sebelum menghapus.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="border border-gray-200 text-gray-500 text-sm font-bold px-4 py-2 rounded-lg hover:opacity-80"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKamar;