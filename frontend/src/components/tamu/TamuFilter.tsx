interface TamuFilterProps {
  search: string;
  setSearch: (value: string) => void;
  onExport: (format: "csv" | "json") => void;
}

export const TamuFilter = ({ search, setSearch, onExport }: TamuFilterProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 className="text-lg font-bold text-gray-900">Daftar Tamu</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari tamu, penghuni, kamar..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 md:w-64"
        />

        <div className="flex gap-2">
          <button
            onClick={() => onExport("csv")}
            className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors whitespace-nowrap cursor-pointer"
            title="Unduh Laporan CSV"
          >
            CSV
          </button>
          <button
            onClick={() => onExport("json")}
            className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap cursor-pointer"
            title="Unduh Laporan JSON"
          >
            JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default TamuFilter;
