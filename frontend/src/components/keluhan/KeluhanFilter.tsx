import type { KeluhanStatus } from "../../types";

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

interface KeluhanFilterProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: KeluhanStatus | "semua";
  setStatusFilter: (value: KeluhanStatus | "semua") => void;
  onExport: (format: "csv" | "json") => void;
}

export const KeluhanFilter = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onExport,
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

        <div className="flex gap-2">
          <button
            onClick={() => onExport("csv")}
            className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
            title="Unduh Laporan CSV"
          >
            CSV
          </button>
          <button
            onClick={() => onExport("json")}
            className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
            title="Unduh Laporan JSON"
          >
            JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeluhanFilter;
