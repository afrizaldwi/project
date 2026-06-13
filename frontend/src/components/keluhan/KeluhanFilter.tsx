import type { KeluhanStatus } from "../../types";

const statusOptions: Array<KeluhanStatus | "semua"> = [
  "semua",
  "pending",
  "proses",
  "selesai",
];

const statusLabel: Record<KeluhanStatus | "semua", string> = {
  semua: "Semua",
  pending: "Menunggu",
  proses: "Diproses",
  selesai: "Selesai",
};

interface KeluhanFilterProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: KeluhanStatus | "semua";
  setStatusFilter: (value: KeluhanStatus | "semua") => void;
}

export const KeluhanFilter = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: KeluhanFilterProps) => {
  return (
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
  );
};

export default KeluhanFilter;
