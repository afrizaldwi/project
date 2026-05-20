import type { PenghuniItem } from "../../types";

interface PenghuniTableDesktopProps {
  isLoading: boolean;
  filteredPenghuni: PenghuniItem[];
  handleSelesaikan: (idSewa: number) => void;
}

const PenghuniTableDesktop = ({
  isLoading,
  filteredPenghuni,
  handleSelesaikan,
}: PenghuniTableDesktopProps) => {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
            <tr>
              <th className="px-5 py-4">Nama</th>
              <th className="px-5 py-4">Kamar</th>
              <th className="px-5 py-4">Tgl Masuk</th>
              <th className="px-5 py-4">Tgl Keluar</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={6}>
                  Memuat data...
                </td>
              </tr>
            ) : filteredPenghuni.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={6}>
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              filteredPenghuni.map((item) => (
                <tr key={item.id_sewa} className="transition-colors hover:bg-light/70">
                  <td className="px-5 py-4">
                    <p className="font-black text-dark">
                      {item.user?.nama_lengkap || "-"}
                    </p>
                    <p className="text-xs font-medium text-dark/40">
                      {item.user?.email || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-dark">
                      {item.kamar?.nomor_kamar || "-"}
                    </p>
                    <p className="text-xs font-medium text-dark/40">
                      {item.kamar?.luas_kamar || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-medium text-dark/70">
                    {item.tanggal_masuk}
                  </td>

                  <td className="px-5 py-4 font-medium text-dark/70">
                    {item.tanggal_keluar || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                        item.status_sewa === "aktif"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {item.status_sewa === "aktif" ? "Aktif" : "Non Aktif"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {item.status_sewa === "aktif" ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          disabled
                          title="Fitur perpanjangan sewa akan diintegrasikan dari fitur Falissa"
                          className="cursor-not-allowed text-xs font-black text-dark/30"
                        >
                          Perpanjang
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelesaikan(item.id_sewa)}
                          className="text-xs font-black text-danger underline underline-offset-4 transition-colors hover:text-danger/80"
                        >
                          Arsipkan
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-dark/30">-</span>
                    )}
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

export default PenghuniTableDesktop;
