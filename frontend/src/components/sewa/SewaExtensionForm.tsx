interface SewaExtensionFormProps {
  tanggalMulai: string;
  durasi: number;
  hargaBulanan: number;
  totalTagihan: number;
  estimasiTanggalKeluar: string;
  onDurasiChange: (durasi: number) => void;
  formatRupiah: (value: number) => string;
}

const SewaExtensionForm = ({
  tanggalMulai,
  durasi,
  hargaBulanan,
  totalTagihan,
  estimasiTanggalKeluar,
  onDurasiChange,
  formatRupiah,
}: SewaExtensionFormProps) => {
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Tanggal Mulai Perpanjangan
        </label>
        <input
          type="date"
          value={tanggalMulai}
          readOnly
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Durasi Perpanjangan
        </label>
        <select
          value={durasi}
          onChange={(e) => onDurasiChange(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {month} bulan
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Harga Bulanan</label>
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900">
          {formatRupiah(hargaBulanan)}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Estimasi Tanggal Keluar Baru
        </label>
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900">
          {estimasiTanggalKeluar}
        </div>
      </div>

      <div className="md:col-span-2 rounded-xl bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-700">Total Tagihan Perpanjangan</p>
        <p className="mt-1 text-2xl font-bold text-blue-900">{formatRupiah(totalTagihan)}</p>
        <p className="mt-1 text-xs text-blue-700">
          {formatRupiah(hargaBulanan)} × {durasi} bulan
        </p>
      </div>
    </div>
  );
};

export default SewaExtensionForm;
