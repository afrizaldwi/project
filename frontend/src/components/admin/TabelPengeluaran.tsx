import type { PengeluaranItem } from "../../types";

interface TabelPengeluaranProps {
  isLoading: boolean;
  pengeluaran: PengeluaranItem[];
  tagihanBelumBayar: number;
  formatRupiah: (value: number) => string;
  onDelete: (id: number) => void;
}

const TabelPengeluaran = ({
  isLoading,
  pengeluaran,
  tagihanBelumBayar,
  formatRupiah,
  onDelete,
}: TabelPengeluaranProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h2 className="text-lg font-black text-dark">Daftar Pengeluaran</h2>
        <p className="text-sm font-medium text-dark/40">
          Total tagihan belum bayar:{" "}
          <span className="font-black text-warning">
            {formatRupiah(tagihanBelumBayar)}
          </span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
            <tr>
              <th className="px-5 py-4">Tanggal</th>
              <th className="px-5 py-4">Keterangan</th>
              <th className="px-5 py-4">Jumlah</th>
              <th className="px-5 py-4">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={4}>
                  Memuat data...
                </td>
              </tr>
            ) : pengeluaran.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={4}>
                  Belum ada pengeluaran pada periode ini.
                </td>
              </tr>
            ) : (
              pengeluaran.map((item) => (
                <tr key={item.id_pengeluaran} className="transition-colors hover:bg-light/70">
                  <td className="px-5 py-4 font-medium text-dark/70">
                    {item.tanggal_pengeluaran}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-black text-dark">{item.judul_pengeluaran}</p>
                    <p className="text-xs font-medium text-dark/40">
                      {item.deskripsi || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-black text-danger">
                    {formatRupiah(Number(item.jumlah_pengeluaran))}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onDelete(item.id_pengeluaran)}
                      className="text-xs font-black text-danger underline underline-offset-4 transition-colors hover:text-danger/80"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelPengeluaran;
