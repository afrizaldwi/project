import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import sewaExtensionService from "../../services/sewaExtensionService";
import type { SewaExtensionDetail } from "../../types";

const formatTanggal = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

type TabType = "aktif" | "alumni";

const AdminPenghuni = () => {
  const navigate = useNavigate();

  const [sewaList, setSewaList] = useState<SewaExtensionDetail[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("aktif");

  const filteredSewa = useMemo(() => {
    const keyword = search.toLowerCase();
    return sewaList.filter((sewa) => {
      return (
        sewa.nama.toLowerCase().includes(keyword) ||
        sewa.email.toLowerCase().includes(keyword) ||
        sewa.nomor_kamar.toLowerCase().includes(keyword)
      );
    });
  }, [sewaList, search]);

  useEffect(() => {
    sewaExtensionService
      .getAll()
      .then((data) => {
        setSewaList(data);
      })
      .catch(() => {
        setError("Gagal memuat data penghuni aktif.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Penghuni</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola data penghuni Kost Bahagia</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + Tambah Penghuni
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 pt-4 pb-0 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("aktif")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === "aktif"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Penghuni Aktif
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("alumni")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === "alumni"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Riwayat / Alumni
            </button>
          </div>

          <div className="pb-4 md:pb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama penghuni atau kamar..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 md:w-72"
            />
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Memuat data penghuni aktif...
          </div>
        ) : filteredSewa.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Tidak ada data penghuni aktif.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Nama
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Kamar
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Tgl Masuk
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Tgl Keluar
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredSewa.map((sewa) => (
                    <tr key={sewa.id_sewa} className="hover:bg-gray-50/60">
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-900">{sewa.nama}</p>
                        <p className="text-xs text-gray-400">{sewa.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">{sewa.nomor_kamar}</p>
                        <p className="text-xs text-gray-400">{sewa.ukuran_kamar ?? ""}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {formatTanggal(sewa.tanggal_masuk)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {formatTanggal(sewa.tanggal_keluar)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                          AKTIF
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/penghuni/perpanjang/${sewa.id_sewa}`)
                            }
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            Perpanjang
                          </button>
                          <button
                            type="button"
                            disabled
                            className="text-sm font-semibold text-red-500 opacity-60"
                          >
                            Arsipkan
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-100 md:hidden">
              {filteredSewa.map((sewa) => (
                <article key={sewa.id_sewa} className="space-y-3 p-4">
                  <div>
                    <p className="font-bold text-gray-900">{sewa.nama}</p>
                    <p className="text-sm text-gray-400">{sewa.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <InfoItem label="Kamar" value={sewa.nomor_kamar} />
                    <InfoItem label="Status" value="Aktif" />
                    <InfoItem label="Masuk" value={formatTanggal(sewa.tanggal_masuk)} />
                    <InfoItem label="Keluar" value={formatTanggal(sewa.tanggal_keluar)} />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/penghuni/perpanjang/${sewa.id_sewa}`)
                      }
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Perpanjang
                    </button>
                    <button
                      type="button"
                      disabled
                      className="text-sm font-semibold text-red-500 opacity-60"
                    >
                      Arsipkan
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-xs font-medium text-gray-400">{label}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

export default AdminPenghuni;