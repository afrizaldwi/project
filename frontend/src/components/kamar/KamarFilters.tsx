import type { KamarStatus } from "../../types";

type KamarStatusFilter = KamarStatus | "semua";

interface KamarFiltersProps {
  search: string;
  filterStatus: KamarStatusFilter;
  viewMode: "grid" | "list";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: KamarStatusFilter) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
}

const KamarFilters = ({
  search,
  filterStatus,
  viewMode,
  onSearchChange,
  onStatusChange,
  onViewModeChange,
}: KamarFiltersProps) => {
  return (
    <div className="flex gap-3 items-center flex-wrap">
      <div className="relative flex-1 min-w-48">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nomor kamar..."
          className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm bg-white text-dark outline-none focus:border-primary"
        />
      </div>
      <select
        value={filterStatus}
        onChange={(e) => onStatusChange(e.target.value as KamarStatusFilter)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-dark outline-none"
      >
        <option value="semua">Semua Status</option>
        <option value="tersedia">Tersedia</option>
        <option value="terisi">Terisi</option>
        <option value="perbaikan">Perbaikan</option>
      </select>
      <div className="md:flex border border-gray-200 rounded-lg overflow-hidden hidden">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`px-3 py-2 text-sm transition ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-400"}`}
        >
          ⊞
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`px-3 py-2 text-sm transition ${viewMode === "list" ? "bg-primary text-white" : "bg-white text-gray-400"}`}
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default KamarFilters;
