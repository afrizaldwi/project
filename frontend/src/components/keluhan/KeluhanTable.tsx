import type { Keluhan, KeluhanStatus } from "../../types";
import { getStorageUrl } from "../../utils/storageUrl";


const statusLabel: Record<KeluhanStatus, string> = {
  pending: "Menunggu",
  proses: "Diproses",
  selesai: "Selesai",
};

const statusClass: Record<KeluhanStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  proses: "bg-blue-50 text-blue-700 border-blue-200",
  selesai: "bg-green-50 text-green-700 border-green-200",
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

interface KeluhanTableProps {
  data: Keluhan[];
  isLoading: boolean;
  isUpdatingId: number | null;
  onUpdateStatus: (id: number, status: KeluhanStatus) => void;
  onDelete: (id: number) => void;
  onPreviewImage: (url: string) => void;
}

export const KeluhanTable = ({
  data,
  isLoading,
  isUpdatingId,
  onUpdateStatus,
  onDelete,
  onPreviewImage,
}: KeluhanTableProps) => {
  if (isLoading) {
    return (
      <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
        Memuat laporan kerusakan...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
        Belum ada laporan kerusakan.
      </div>
    );
  }

  return (
    <div className="mt-5 w-full">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 hidden md:table-header-group">
          <tr>
            <th className="px-4 py-3 font-semibold">Laporan</th>
            <th className="px-4 py-3 font-semibold">Penghuni</th>
            <th className="px-4 py-3 font-semibold">Kamar</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Tanggal Lapor</th>
            <th className="px-4 py-3 font-semibold">Foto</th>
            <th className="px-4 py-3 font-semibold">Aksi</th>
          </tr>
        </thead>

        <tbody className="block md:table-row-group md:divide-y divide-gray-100 bg-transparent md:bg-white">
          {data.map((item) => (
            <tr
              key={item.id_keluhan}
              className="block md:table-row bg-white mb-4 md:mb-0 border md:border-0 border-gray-100 rounded-xl shadow-sm md:shadow-none align-top transition-colors hover:bg-gray-50"
            >
              <td className="flex flex-col sm:flex-row sm:justify-between items-start md:table-cell p-4 border-b md:border-none border-gray-50">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1 sm:mb-0">Laporan</span>
                <div className="text-left sm:text-right md:text-left">
                  <p className="font-semibold text-gray-900">{item.judul_keluhan}</p>
                  <p className="mt-1 max-w-xs text-xs text-gray-500 line-clamp-2 md:line-clamp-none">
                    {item.deskripsi_keluhan}
                  </p>
                </div>
              </td>

              <td className="flex justify-between items-start md:table-cell p-4 border-b md:border-none border-gray-50">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Penghuni</span>
                <div className="text-right md:text-left">
                  <p className="font-semibold text-gray-900">{item.nama_penghuni}</p>
                  <p className="text-xs text-gray-500">{item.email_penghuni}</p>
                </div>
              </td>

              <td className="flex justify-between items-center md:table-cell p-4 border-b md:border-none border-gray-50">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Kamar</span>
                <span className="font-medium text-gray-900">{item.nomor_kamar}</span>
              </td>

              <td className="flex justify-between items-center md:table-cell p-4 border-b md:border-none border-gray-50">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Status</span>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[item.status_keluhan]
                    }`}
                >
                  {statusLabel[item.status_keluhan]}
                </span>
              </td>

              <td className="flex justify-between items-center md:table-cell p-4 border-b md:border-none border-gray-50">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Tanggal</span>
                <span className="text-gray-600">{formatTanggal(item.tanggal_lapor)}</span>
              </td>

              <td className="flex justify-between items-start md:table-cell p-4 border-b md:border-none border-gray-50">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Foto</span>
                <div className="text-right md:text-left">
                  {item.foto_kerusakan ? (
                    <div className="flex flex-row md:flex-col gap-1.5 flex-wrap justify-end md:justify-start">
                      {item.foto_kerusakan.split(",").map((path, idx) => {
                        const url = getStorageUrl(path);
                        return url ? (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onPreviewImage(url)}
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors whitespace-nowrap text-center cursor-pointer"
                          >
                            Foto {idx + 1}
                          </button>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Tidak ada</span>
                  )}
                </div>
              </td>

              <td className="flex flex-col md:table-cell p-4 gap-2">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase mb-2">Aksi</span>
                <div className="flex flex-row md:flex-col gap-2 w-full">
                  <select
                    value={item.status_keluhan}
                    disabled={isUpdatingId === item.id_keluhan}
                    onChange={(event) =>
                      onUpdateStatus(
                        item.id_keluhan,
                        event.target.value as KeluhanStatus
                      )
                    }
                    className="flex-1 md:flex-none rounded-lg border border-gray-200 bg-white px-2 py-2 md:py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="pending">Menunggu</option>
                    <option value="proses">Diproses</option>
                    <option value="selesai">Selesai</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id_keluhan)}
                    className="flex-1 md:flex-none rounded-lg border border-red-200 bg-red-50 px-3 py-2 md:py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 cursor-pointer"
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
  );
};

export default KeluhanTable;
