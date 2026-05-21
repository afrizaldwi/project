interface TamuFilterProps {
  search: string;
  setSearch: (value: string) => void;
}

export const TamuFilter = ({ search, setSearch }: TamuFilterProps) => {
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
      </div>
    </div>
  );
};

export default TamuFilter;
