import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePenghuni from "../../hook/usePenghuni";

const AdminPenghuni = () => {
  const navigate = useNavigate();
  const { aktif, alumni, isLoading, error, updateStatus } = usePenghuni();
  const [activeTab, setActiveTab] = useState("aktif");
  const [search, setSearch] = useState("");

  const currentData = (activeTab === "aktif" ? aktif : alumni).filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.nomor_kamar.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus(id, status === "Aktif" ? "aktif" : "selesai");
    } catch {
      alert("Gagal mengubah status.");
    }
  };

  const formatTanggal = (tgl: string) => {
    if (!tgl || tgl === "-") return "-";
    const [year, month, day] = tgl.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-light p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Data Penghuni</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola data penghuni Kost Bahagia</p>
        </div>
        <button
          onClick={() => navigate("/admin/penghuni/tambah")}
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition"
        >
          + Tambah Penghuni
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex bg-white rounded-lg p-1 border border-gray-100">
          <button
            onClick={() => setActiveTab("aktif")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "aktif" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            Penghuni Aktif
          </button>
          <button
            onClick={() => setActiveTab("riwayat")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "riwayat" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            Riwayat / Alumni
          </button>
        </div>
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Cari nama penghuni..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Nama</th>
              <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Kamar</th>
              <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Tgl Masuk</th>
              <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Tgl Keluar</th>
              <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Detail</th>
              <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Perpanjang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={7} className="p-10 text-center text-gray-400 text-sm">Memuat data...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id_sewa} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-dark">{item.nama}</td>
                  <td className="px-6 py-4 font-bold text-dark">{item.nomor_kamar}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{formatTanggal(item.tanggal_masuk)}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{formatTanggal(item.tanggal_keluar)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={item.status_sewa === "aktif" ? "Aktif" : "Non Aktif"}
                      onChange={(e) => handleStatusChange(item.id_sewa, e.target.value)}
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer outline-none border-none ${
                        item.status_sewa === "aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non Aktif">Non Aktif</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/admin/penghuni/detail/${item.id_sewa}`)}
                      className="text-blue-500 hover:opacity-80 font-bold text-xs underline underline-offset-4"
                    >
                      Detail
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {item.status_sewa === "aktif" ? (
                      <button
                        onClick={() => navigate(`/admin/penghuni/perpanjang/${item.id_sewa}`)}
                        className="text-primary hover:opacity-80 font-bold text-xs underline underline-offset-4"
                      >
                        Perpanjang
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="p-20 text-center text-gray-400 italic text-sm">Tidak ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPenghuni;