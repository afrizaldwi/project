import React from "react";
import { CheckCircle, Upload } from "lucide-react";
import type { TagihanReminderItem } from "../../../types";
import { formatRupiah, formatDate, getStatusConfig } from "../../../utils/tagihanHelpers";

interface ActiveTagihanCardProps {
  activeTagihan: TagihanReminderItem[];
  onPay: (item: TagihanReminderItem) => void;
}

const canPay = (item: TagihanReminderItem) => {
  if (item.status_tagihan === "lunas") return false;
  if (item.pembayaran_terbaru?.status_verifikasi === "pending") return false;
  return true;
};

const ActiveTagihanCard: React.FC<ActiveTagihanCardProps> = ({
  activeTagihan,
  onPay,
}) => {
  return (
    <>
      {activeTagihan.length === 0 ? (
        <div className="rounded-2xl border border-success/20 bg-success/10 p-6 text-center shadow-sm">
          <CheckCircle className="mx-auto mb-3 text-success" size={32} />
          <p className="font-black text-dark">Semua tagihan sudah beres!</p>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Terima kasih telah membayar tepat waktu.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {activeTagihan.map((item) => {
            const status = getStatusConfig(item);

            return (
              <div
                key={item.id_tagihan}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-dark/40">
                      {item.kode_invoice}
                    </p>
                    <h3 className="mt-1 text-lg font-black text-dark">
                      Kamar {item.kamar.nomor_kamar || "-"}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase ${status.className}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                <div className="grid gap-3 rounded-xl bg-light p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase text-dark/40">
                      Total Tagihan
                    </p>
                    <p className="mt-1 text-xl font-black text-dark">
                      {formatRupiah(item.total_tagihan)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-dark/40">
                      Jatuh Tempo
                    </p>
                    <p className="mt-1 font-black text-dark">
                      {formatDate(item.tanggal_jatuh_tempo)}
                    </p>
                  </div>
                </div>

                {item.pembayaran_terbaru?.status_verifikasi === "ditolak" &&
                  item.pembayaran_terbaru.catatan_admin && (
                    <div className="mt-4 rounded-xl border border-danger/20 bg-danger/10 p-3 text-sm font-semibold text-danger">
                      Catatan admin: {item.pembayaran_terbaru.catatan_admin}
                    </div>
                  )}

                <button
                  type="button"
                  disabled={!canPay(item)}
                  onClick={() => onPay(item)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:bg-dark/20 disabled:shadow-none"
                >
                  <Upload size={16} />
                  {item.pembayaran_terbaru?.status_verifikasi === "pending"
                    ? "Menunggu Verifikasi"
                    : "Bayar Sekarang"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ActiveTagihanCard;
