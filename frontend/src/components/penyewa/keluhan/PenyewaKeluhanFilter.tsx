import type { KeluhanStatus } from "../../../types";

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

interface PenyewaKeluhanFilterProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: KeluhanStatus | "semua";
  setStatusFilter: (value: KeluhanStatus | "semua") => void;
}

export const PenyewaKeluhanFilter = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: PenyewaKeluhanFilterProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Riwayat Laporan</h2>
        <p className="text-sm text-gray-500">
          Anda hanya dapat melihat laporan dari sewa aktif milik Anda.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari laporan..."
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
  );
};

export default PenyewaKeluhanFilter;
