import React from "react";
import { X } from "lucide-react";
import type { PendingPembayaranItem } from "../../../types";
import { formatRupiah } from "../../../utils/tagihanHelpers";
import { getStorageUrl } from "../../../utils/storageUrl";

interface PaymentVerificationModalProps {
  preview: PendingPembayaranItem;
  catatan: string;
  onCatatanChange: (value: string) => void;
  onClose: () => void;
  onVerify: (idPembayaran: number, action: "diterima" | "ditolak") => void;
  verifyingId: number | null;
}

const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({
  preview,
  catatan,
  onCatatanChange,
  onClose,
  onVerify,
  verifyingId,
}) => {
  const buktiBayarUrl = getStorageUrl(preview.bukti_bayar_url || preview.bukti_bayar);
  const proofPath = buktiBayarUrl.toLowerCase().split("?")[0].split("#")[0];
  const isImageProof = [".jpg", ".jpeg", ".png", ".webp"].some((ext) =>
    proofPath.endsWith(ext)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-black text-dark">Verifikasi Pembayaran</h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-dark/40 hover:bg-light hover:text-dark"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-light p-4">
            <p className="text-xs font-bold uppercase text-dark/40">Penyewa</p>
            <p className="mt-1 font-black text-dark">
              {preview.tagihan?.penyewa.nama_lengkap || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-light p-4">
              <p className="text-xs font-bold uppercase text-dark/40">Nominal</p>
              <p className="mt-1 font-black text-dark">
                {formatRupiah(preview.jumlah_bayar)}
              </p>
            </div>

            <div className="rounded-xl bg-light p-4">
              <p className="text-xs font-bold uppercase text-dark/40">Metode</p>
              <p className="mt-1 font-black capitalize text-dark">
                {preview.metode_pembayaran}
              </p>
            </div>
          </div>

          {buktiBayarUrl ? (
            <div className="space-y-3">
              {isImageProof ? (
                <a href={buktiBayarUrl} target="_blank" rel="noreferrer">
                  <img
                    src={buktiBayarUrl}
                    alt="Bukti pembayaran"
                    className="max-h-72 w-full rounded-xl border border-gray-100 object-contain"
                  />
                </a>
              ) : (
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm font-semibold text-primary">
                  File bukti pembayaran bukan gambar. Buka file untuk melihat detail.
                </div>
              )}

              <a
                href={buktiBayarUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-primary/20 bg-primary/10 p-4 text-center text-sm font-black text-primary hover:bg-primary/20"
              >
                Buka Bukti Pembayaran
              </a>
            </div>
          ) : (
            <div className="rounded-xl border border-warning/20 bg-warning/10 p-4 text-sm font-semibold text-warning">
              Bukti pembayaran belum tersedia.
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-bold text-dark/70">
              Catatan Tambahan
            </label>
            <textarea
              value={catatan}
              onChange={(event) => onCatatanChange(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Opsional..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              disabled={verifyingId === preview.id_pembayaran}
              onClick={() => onVerify(preview.id_pembayaran, "ditolak")}
              className="rounded-xl border border-danger/20 px-4 py-3 text-xs font-black uppercase text-danger hover:bg-danger/10 disabled:opacity-60"
            >
              Tolak
            </button>

            <button
              type="button"
              disabled={verifyingId === preview.id_pembayaran}
              onClick={() => onVerify(preview.id_pembayaran, "diterima")}
              className="rounded-xl bg-success px-4 py-3 text-xs font-black uppercase text-white shadow-lg shadow-success/20 hover:bg-success/90 disabled:opacity-60"
            >
              {verifyingId === preview.id_pembayaran ? "Memproses..." : "Terima"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationModal;
