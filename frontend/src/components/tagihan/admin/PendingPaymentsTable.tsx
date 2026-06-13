import React from "react";
import { Eye } from "lucide-react";
import type { PendingPembayaranItem } from "../../../types";
import { formatRupiah, formatDate } from "../../../utils/tagihanHelpers";

interface PendingPaymentsTableProps {
  pendingPayments: PendingPembayaranItem[];
  isLoading: boolean;
  onInspect: (payment: PendingPembayaranItem) => void;
}

const PendingPaymentsTable: React.FC<PendingPaymentsTableProps> = ({
  pendingPayments,
  isLoading,
  onInspect,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
          <tr>
            <th className="px-5 py-4">Penyewa</th>
            <th className="px-5 py-4">Jumlah Bayar</th>
            <th className="px-5 py-4">Metode</th>
            <th className="px-5 py-4">Tanggal</th>
            <th className="px-5 py-4">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            <tr>
              <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={5}>
                Memuat data...
              </td>
            </tr>
          ) : pendingPayments.length === 0 ? (
            <tr>
              <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={5}>
                Tidak ada pembayaran yang menunggu validasi.
              </td>
            </tr>
          ) : (
            pendingPayments.map((payment) => (
              <tr
                key={payment.id_pembayaran}
                className="transition-colors hover:bg-light/70"
              >
                <td className="px-5 py-4">
                  <p className="font-black text-dark">
                    {payment.tagihan?.penyewa.nama_lengkap || "-"}
                  </p>
                  <p className="text-xs font-medium text-dark/40">
                    Kamar {payment.tagihan?.kamar.nomor_kamar || "-"}
                  </p>
                </td>

                <td className="px-5 py-4 font-black text-dark">
                  {formatRupiah(payment.jumlah_bayar)}
                </td>

                <td className="px-5 py-4 font-medium capitalize text-dark/70">
                  {payment.metode_pembayaran}
                </td>

                <td className="px-5 py-4 font-medium text-dark/70">
                  {formatDate(payment.tanggal_bayar)}
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onInspect(payment)}
                    className="inline-flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/10 px-4 py-2 text-xs font-black text-warning hover:bg-warning/20"
                  >
                    <Eye size={14} />
                    Periksa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingPaymentsTable;
