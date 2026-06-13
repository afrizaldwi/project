interface PenyewaTamuFilterProps {
  search: string;
  setSearch: (value: string) => void;
}

export const PenyewaTamuFilter = ({
  search,
  setSearch,
}: PenyewaTamuFilterProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 className="text-lg font-bold text-gray-900">Riwayat Tamu</h2>
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cari tamu atau keperluan..."
        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 md:max-w-xs"
      />
    </div>
  );
};

export default PenyewaTamuFilter;
