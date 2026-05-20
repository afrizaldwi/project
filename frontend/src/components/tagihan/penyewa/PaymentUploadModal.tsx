import React from "react";
import { X, CheckCircle, CreditCard, FileText, Upload } from "lucide-react";
import type { TagihanReminderItem } from "../../../types";
import { formatRupiah } from "../../../utils/tagihanHelpers";

interface PaymentUploadModalProps {
  selected: TagihanReminderItem;
  metode: string;
  onMetodeChange: (value: string) => void;
  file: File | null;
  filePreview: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onUpload: () => void;
  isUploading: boolean;
  successMessage: string;
}

const PaymentUploadModal: React.FC<PaymentUploadModalProps> = ({
  selected,
  metode,
  onMetodeChange,
  file,
  filePreview,
  onFileChange,
  onClose,
  onUpload,
  isUploading,
  successMessage,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-black text-dark">Konfirmasi Bayar</h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-dark/40 hover:bg-light hover:text-dark"
          >
            <X size={18} />
          </button>
        </div>

        {successMessage ? (
          <div className="rounded-xl border border-success/20 bg-success/10 p-5 text-center">
            <CheckCircle className="mx-auto mb-3 text-success" size={32} />
            <p className="font-black text-dark">{successMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-light p-4">
              <p className="text-xs font-bold uppercase text-dark/40">
                Total Tagihan
              </p>
              <p className="mt-1 text-2xl font-black text-dark">
                {formatRupiah(selected.total_tagihan)}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-dark/70">
                Metode Pembayaran
              </label>
              <select
                value={metode}
                onChange={(event) => onMetodeChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-light p-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Metode Pembayaran</option>
                <option value="transfer bank">Transfer Bank</option>
                <option value="e-wallet">E-Wallet</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-dark/70">
                Upload Bukti Bayar
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-light p-6 text-center transition-all hover:border-primary/40">
                <CreditCard className="mb-2 text-primary" size={28} />
                <p className="text-sm font-black text-dark">
                  {file ? file.name : "Pilih file bukti bayar"}
                </p>
                <p className="mt-1 text-xs font-medium text-dark/40">
                  JPG, PNG, atau PDF maksimal 5MB
                </p>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {filePreview ? (
              <img
                src={filePreview}
                alt="Preview bukti bayar"
                className="max-h-48 w-full rounded-xl object-cover"
              />
            ) : file ? (
              <div className="flex items-center gap-3 rounded-xl bg-light p-4">
                <FileText className="text-primary" size={24} />
                <p className="text-sm font-bold text-dark">{file.name}</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onUpload}
              disabled={isUploading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:opacity-70"
            >
              <Upload size={16} />
              {isUploading ? "Memproses..." : "Kirim Bukti Bayar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentUploadModal;
