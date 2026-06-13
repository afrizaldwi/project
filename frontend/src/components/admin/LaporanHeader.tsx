interface MonthOption {
  value: number;
  label: string;
}

interface LaporanHeaderProps {
  bulan: number;
  tahun: number;
  monthOptions: MonthOption[];
  yearOptions: number[];
  setBulan: (bulan: number) => void;
  setTahun: (tahun: number) => void;
  onToggleForm: () => void;
  onExportCsv: () => void;
}

const LaporanHeader = ({
  bulan,
  tahun,
  monthOptions,
  yearOptions,
  setBulan,
  setTahun,
  onToggleForm,
  onExportCsv,
}: LaporanHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-black text-dark">Laporan Keuangan</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={bulan}
          onChange={(event) => setBulan(Number(event.target.value))}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <select
          value={tahun}
          onChange={(event) => setTahun(Number(event.target.value))}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-28"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onToggleForm}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent"
        >
          + Catat Pengeluaran
        </button>

        <button
          type="button"
          onClick={onExportCsv}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-black text-dark/60 transition-all hover:border-primary/30 hover:text-primary"
        >
          Cetak CSV
        </button>
      </div>
    </div>
  );
};

export default LaporanHeader;
