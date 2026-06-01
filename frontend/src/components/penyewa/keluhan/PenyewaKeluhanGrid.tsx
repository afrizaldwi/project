import type { Keluhan, KeluhanStatus } from "../../../types";
import { getStorageUrl } from "../../../utils/storageUrl";

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

interface PenyewaKeluhanGridProps {
  data: Keluhan[];
  isLoading: boolean;
  onPreviewImage: (url: string) => void;
}

export const PenyewaKeluhanGrid = ({
  data,
  isLoading,
  onPreviewImage,
}: PenyewaKeluhanGridProps) => {
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
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <article
          key={item.id_keluhan}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900">{item.judul_keluhan}</h3>
              <p className="mt-1 text-xs text-gray-500">
                {formatTanggal(item.tanggal_lapor)}
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                statusClass[item.status_keluhan]
              }`}
            >
              {statusLabel[item.status_keluhan]}
            </span>
          </div>

          <p className="mt-4 text-sm text-gray-600">{item.deskripsi_keluhan}</p>

          <div className="mt-4 text-xs text-gray-500">
            <p>Kamar: {item.nomor_kamar}</p>
            <p>Selesai: {formatTanggal(item.tanggal_selesai)}</p>
          </div>

          {item.foto_kerusakan && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.foto_kerusakan.split(",").map((path, idx) => {
                const url = getStorageUrl(path);
                return url ? (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onPreviewImage(url)}
                    className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    Lihat Foto {idx + 1}
                  </button>
                ) : null;
              })}
            </div>
          )}
        </article>
      ))}
    </div>
  );
};

export default PenyewaKeluhanGrid;
