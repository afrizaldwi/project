type StatusFilter = "aktif" | "selesai";

interface PenghuniFilterProps {
  status: StatusFilter;
  setStatus: (status: StatusFilter) => void;
  search: string;
  setSearch: (search: string) => void;
}

const PenghuniFilter = ({
  status,
  setStatus,
  search,
  setSearch,
}: PenghuniFilterProps) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full rounded-xl bg-light p-1 md:w-auto">
          <button
            type="button"
            onClick={() => setStatus("aktif")}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
              status === "aktif"
                ? "bg-primary text-white shadow-sm"
                : "text-dark/40 hover:text-dark"
            }`}
          >
            Penghuni Aktif
          </button>

          <button
            type="button"
            onClick={() => setStatus("selesai")}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
              status === "selesai"
                ? "bg-primary text-white shadow-sm"
                : "text-dark/40 hover:text-dark"
            }`}
          >
            Riwayat / Alumni
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari nama penghuni atau kamar..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-gray-100 bg-light px-4 py-2 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 md:max-w-xs"
        />
      </div>
    </div>
  );
};

export default PenghuniFilter;
