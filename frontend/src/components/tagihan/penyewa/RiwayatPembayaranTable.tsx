import React from "react";
import type { TagihanReminderItem } from "../../../types";
import { formatRupiah, formatDate, getStatusConfig } from "../../../utils/tagihanHelpers";

interface RiwayatPembayaranTableProps {
  riwayatPembayaran: TagihanReminderItem[];
}

const RiwayatPembayaranTable: React.FC<RiwayatPembayaranTableProps> = ({
  riwayatPembayaran,
}) => {
  return (
    <>
      {riwayatPembayaran.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm font-semibold text-dark/50 shadow-sm">
          Belum ada riwayat pembayaran.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-left text-sm">
              <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
                <tr>
                  <th className="px-5 py-4">Invoice</th>
                  <th className="px-5 py-4">Jatuh Tempo</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {riwayatPembayaran.map((item) => {
                  const status = getStatusConfig(item);

                  return (
                    <tr key={item.id_tagihan} className="hover:bg-light/70">
                      <td className="px-5 py-4">
                        <p className="font-black text-dark">{item.kode_invoice}</p>
                        <p className="text-xs font-medium text-dark/40">
                          Kamar {item.kamar.nomor_kamar || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-dark/70">
                        {formatDate(item.tanggal_jatuh_tempo, true)}
                      </td>

                      <td className="px-5 py-4 font-black text-dark">
                        {formatRupiah(item.total_tagihan)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default RiwayatPembayaranTable;
