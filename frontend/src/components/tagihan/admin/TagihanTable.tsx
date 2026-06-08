import React, { useState } from "react";
import { Download, MessageCircle } from "lucide-react";
import type { TagihanReminderItem } from "../../../types";
import {
  formatRupiah,
  formatDate,
  getStatusConfig,
  isTagihanOpen,
} from "../../../utils/tagihanHelpers";
import { downloadPdfBlob, invoiceApi } from "../../../api/invoice";

interface TagihanTableProps {
  tagihan: TagihanReminderItem[];
  isLoading: boolean;
}

const TagihanTable: React.FC<TagihanTableProps> = ({ tagihan, isLoading }) => {
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<number | null>(null);

  const handleDownloadInvoicePdf = async (
    idPembayaran: number,
    idTagihan: number
  ) => {
    try {
      setDownloadingInvoiceId(idPembayaran);

      const blob = await invoiceApi.downloadAdminInvoicePdf(idPembayaran);
      downloadPdfBlob(blob, `invoice-tagihan-${idTagihan}.pdf`);
    } catch {
      alert("Gagal mengunduh invoice PDF.");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bagian Tabel */}
      <div className="w-full">
        {/* Hapus min-w-[900px] agar bisa menyusut jadi block di mobile */}
        <table className="w-full text-left text-sm">
          <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50 hidden md:table-header-group">
            <tr>
              <th className="px-5 py-4">Penyewa / Kamar</th>
              <th className="px-5 py-4">Total Tagihan</th>
              <th className="px-5 py-4">Jatuh Tempo</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Aksi</th>
            </tr>
          </thead>

          {/* Gunakan block di mobile, table-row-group di desktop */}
          <tbody className="block md:table-row-group md:divide-y divide-gray-100">
            {isLoading ? (
              <tr className="block md:table-row">
                <td className="px-5 py-8 text-center font-medium text-dark/50 block md:table-cell" colSpan={5}>
                  Memuat data...
                </td>
              </tr>
            ) : tagihan.length === 0 ? (
              <tr className="block md:table-row">
                <td className="px-5 py-8 text-center font-medium text-dark/50 block md:table-cell" colSpan={5}>
                  Tidak ada data tagihan.
                </td>
              </tr>
            ) : (
              tagihan.map((item) => {
                const status = getStatusConfig(item);
                const pembayaranTerbaru = item.pembayaran_terbaru;

                const canDownloadPdf =
                  item.status_tagihan !== "dibatalkan" &&
                  pembayaranTerbaru?.status_verifikasi === "diterima";

                const canSendWhatsApp =
                  isTagihanOpen(item) &&
                  item.whatsapp.enabled &&
                  Boolean(item.whatsapp.url);

                return (
                  <tr
                    key={item.id_tagihan}
                    // Di mobile: jadi bentuk "Card" dengan border dan shadow. Di desktop: baris tabel biasa.
                    className="block md:table-row bg-white md:bg-transparent mb-4 md:mb-0 border md:border-0 border-gray-100 rounded-xl md:rounded-none transition-colors hover:bg-light/70 shadow-sm md:shadow-none"
                  >
                    {/* Kolom Penyewa */}
                    <td className="flex justify-between items-center md:table-cell px-5 py-3 md:py-4 border-b md:border-none border-gray-50">
                      <span className="md:hidden text-xs font-bold text-dark/50 uppercase">Penyewa</span>
                      <div className="text-right md:text-left">
                        <p className="font-black text-dark">
                          {item.penyewa.nama_lengkap || "-"}
                        </p>
                        <p className="text-xs font-medium text-dark/40">
                          Kamar {item.kamar.nomor_kamar || "-"}
                        </p>
                      </div>
                    </td>

                    {/* Kolom Total Tagihan */}
                    <td className="flex justify-between items-center md:table-cell px-5 py-3 md:py-4 border-b md:border-none border-gray-50">
                      <span className="md:hidden text-xs font-bold text-dark/50 uppercase">Total</span>
                      <span className="font-black text-dark">
                        {formatRupiah(item.total_tagihan)}
                      </span>
                    </td>

                    {/* Kolom Jatuh Tempo */}
                    <td className="flex justify-between items-center md:table-cell px-5 py-3 md:py-4 border-b md:border-none border-gray-50">
                      <span className="md:hidden text-xs font-bold text-dark/50 uppercase">Jatuh Tempo</span>
                      <span className="font-medium text-dark/70">
                        {formatDate(item.tanggal_jatuh_tempo)}
                      </span>
                    </td>

                    {/* Kolom Status */}
                    <td className="flex justify-between items-center md:table-cell px-5 py-3 md:py-4 border-b md:border-none border-gray-50">
                      <span className="md:hidden text-xs font-bold text-dark/50 uppercase">Status</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase ${status.className}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </td>

                    {/* Kolom Aksi */}
                    <td className="flex flex-col md:flex-row justify-between md:justify-start items-start md:items-center md:table-cell px-5 py-4 gap-3 md:gap-0">
                      <span className="md:hidden text-xs font-bold text-dark/50 uppercase mb-1">Aksi</span>
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        {canSendWhatsApp && (
                          <a
                            href={item.whatsapp.url ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 md:flex-none justify-center inline-flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-black text-success hover:bg-success/20 transition-colors"
                          >
                            <MessageCircle size={14} />
                            WhatsApp
                          </a>
                        )}

                        {canDownloadPdf && pembayaranTerbaru && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadInvoicePdf(
                                pembayaranTerbaru.id_pembayaran,
                                item.id_tagihan
                              )
                            }
                            disabled={downloadingInvoiceId === pembayaranTerbaru.id_pembayaran}
                            className="flex-1 md:flex-none justify-center inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-black text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download size={14} />
                            {downloadingInvoiceId === pembayaranTerbaru.id_pembayaran
                              ? "Mengunduh..."
                              : "PDF"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TagihanTable;