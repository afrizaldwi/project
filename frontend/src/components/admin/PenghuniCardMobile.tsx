import type { PenghuniItem } from "../../types";

interface PenghuniCardMobileProps {
  isLoading: boolean;
  filteredPenghuni: PenghuniItem[];
  handleSelesaikan: (idSewa: number) => void;
}

const PenghuniCardMobile = ({
  isLoading,
  filteredPenghuni,
  handleSelesaikan,
}: PenghuniCardMobileProps) => {
  return (
    <div className="space-y-3 md:hidden">
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm font-semibold text-dark/50 shadow-sm">
          Memuat data...
        </div>
      ) : filteredPenghuni.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm font-semibold text-dark/50 shadow-sm">
          Tidak ada data.
        </div>
      ) : (
        filteredPenghuni.map((item) => (
          <div
            key={item.id_sewa}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-black text-dark">
                  {item.user?.nama_lengkap || "-"}
                </h3>
                <p className="truncate text-xs font-medium text-dark/40">
                  {item.user?.email || "-"}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                  item.status_sewa === "aktif"
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {item.status_sewa === "aktif" ? "Aktif" : "Non Aktif"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-light p-3 text-xs">
              <div>
                <p className="font-bold text-dark/40">Kamar</p>
                <p className="mt-1 font-black text-dark">
                  {item.kamar?.nomor_kamar || "-"}
                </p>
                <p className="font-medium text-dark/40">
                  {item.kamar?.luas_kamar || "-"}
                </p>
              </div>

              <div>
                <p className="font-bold text-dark/40">Tanggal Masuk</p>
                <p className="mt-1 font-black text-dark">{item.tanggal_masuk}</p>
              </div>

              <div>
                <p className="font-bold text-dark/40">Tanggal Keluar</p>
                <p className="mt-1 font-black text-dark">
                  {item.tanggal_keluar || "-"}
                </p>
              </div>

              <div>
                <p className="font-bold text-dark/40">Aksi</p>
                {item.status_sewa === "aktif" ? (
                  <div className="mt-1 flex flex-wrap gap-2">
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
                  <span className="mt-1 block text-xs font-bold text-dark/30">-</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PenghuniCardMobile;
