import type { Kamar } from "../../types";
import { getStorageUrl } from "../../utils/storageUrl";
import { getKamarStatusDisplay } from "./kamarStatusDisplay";

interface KamarCardProps {
  kamar: Kamar;
  onEdit: (id: number) => void;
  onDelete: (kamar: { id_kamar: number; nomor_kamar: string }) => void;
}

const KamarCard = ({ kamar, onEdit, onDelete }: KamarCardProps) => {
  const status = getKamarStatusDisplay(kamar.status_kamar);
  const fotoKamarUrl = getStorageUrl(kamar.foto_kamar);
  console.log(fotoKamarUrl);

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
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
        {fotoKamarUrl ? (
          <img
            src={fotoKamarUrl}
            alt={`Kamar ${kamar.nomor_kamar}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl text-gray-300">🛏</span>
        )}
        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <p className="font-bold text-dark text-sm">No. {kamar.nomor_kamar}</p>
        <p className="text-sm font-bold text-primary mb-1">{formatRupiah(kamar.harga_bulanan)} / bulan</p>
        <p className="text-xs text-gray-500 mb-3">📐 {kamar.luas_kamar}</p>

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

        <p className="text-xs text-gray-300 mb-3">
          Ditambahkan: {formatDate(kamar.created_at)}
          {kamar.updated_at !== kamar.created_at && ` · Diedit: ${formatDate(kamar.updated_at)}`}
        </p>

        <div className="flex gap-2 border-t border-gray-50 pt-3">
          <button
            onClick={() => onEdit(kamar.id_kamar)}
            className="flex-1 flex items-center justify-center gap-1 bg-secondary text-primary text-xs font-bold py-2 rounded-lg hover:opacity-80 transition"
          >
            ✏ Ubah
          </button>
          <button
            onClick={() => onDelete({ id_kamar: kamar.id_kamar, nomor_kamar: kamar.nomor_kamar })}
            className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-500 text-xs font-bold py-2 rounded-lg hover:opacity-80 transition"
          >
            🗑 Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default KamarCard;
