import React from "react";
import { MessageCircle } from "lucide-react";
import type { TagihanReminderItem } from "../../../types";
import { formatRupiah, formatDate, getStatusConfig } from "../../../utils/tagihanHelpers";

interface TagihanTableProps {
  tagihan: TagihanReminderItem[];
  isLoading: boolean;
}

const TagihanTable: React.FC<TagihanTableProps> = ({ tagihan, isLoading }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-left text-sm">
        <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
          <tr>
            <th className="px-5 py-4">Penyewa / Kamar</th>
            <th className="px-5 py-4">Total Tagihan</th>
            <th className="px-5 py-4">Jatuh Tempo</th>
            <th className="px-5 py-4">Status</th>
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
          ) : tagihan.length === 0 ? (
            <tr>
              <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={5}>
                Tidak ada data tagihan.
              </td>
            </tr>
          ) : (
            tagihan.map((item) => {
              const status = getStatusConfig(item);

              return (
                <tr key={item.id_tagihan} className="transition-colors hover:bg-light/70">
                  <td className="px-5 py-4">
                    <p className="font-black text-dark">
                      {item.penyewa.nama_lengkap || "-"}
                    </p>
                    <p className="text-xs font-medium text-dark/40">
                      Kamar {item.kamar.nomor_kamar || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-black text-dark">
                    {formatRupiah(item.total_tagihan)}
                  </td>

                  <td className="px-5 py-4 font-medium text-dark/70">
                    {formatDate(item.tanggal_jatuh_tempo)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {item.whatsapp.enabled && item.whatsapp.url ? (
                      <a
                        href={item.whatsapp.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-black text-success hover:bg-success/20"
                      >
                        <MessageCircle size={14} />
                        Kirim WA
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-dark/30">
                        WA tidak tersedia
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TagihanTable;
