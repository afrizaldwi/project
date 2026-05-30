import type { Keluhan, KeluhanStatus } from "../../types";
import { getStorageUrl } from "../../utils/storageUrl";
import { TableHead, TableCell } from "../ui/Table";

const statusLabel: Record<KeluhanStatus, string> = {
  pending: "Pending",
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
          {data.map((item) => (
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
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    statusClass[item.status_keluhan]
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
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-2">
                  <select
                    value={item.status_keluhan}
                    disabled={isUpdatingId === item.id_keluhan}
                    onChange={(event) =>
                      onUpdateStatus(
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
                    onClick={() => onDelete(item.id_keluhan)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 cursor-pointer"
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
  );
};

export default KeluhanTable;
