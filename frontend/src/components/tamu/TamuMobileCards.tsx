import type { Tamu } from "../../types";

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

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <p className="mt-1 font-semibold text-gray-900">{value || "-"}</p>
  </div>
);

interface TamuMobileCardsProps {
  data: Tamu[];
  startNumber?: number;
  onDelete: (id: number) => void;
}

export const TamuMobileCards = ({ data, startNumber = 1, onDelete }: TamuMobileCardsProps) => {
  return (
    <div className="grid gap-4 lg:hidden">
      {data.map((item, index) => (
        <article
          key={item.id_tamu}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-400">#{startNumber + index}</p>
              <h3 className="mt-1 font-bold text-gray-900">{item.nama_tamu}</h3>
              <p className="text-sm text-gray-500">{item.no_hp_tamu}</p>
            </div>

            <button
              type="button"
              onClick={() => onDelete(item.id_tamu)}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 cursor-pointer"
            >
              Hapus
            </button>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <InfoItem label="Penghuni" value={item.nama_penghuni} />
            <InfoItem label="Kamar" value={item.nomor_kamar} />
            <InfoItem label="Waktu" value={formatTanggal(item.waktu_berkunjung)} />
            <InfoItem label="Keperluan" value={item.keperluan} />
          </div>
        </article>
      ))}
    </div>
  );
};

export default TamuMobileCards;
