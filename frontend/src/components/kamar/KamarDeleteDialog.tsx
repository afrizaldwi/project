interface KamarDeleteDialogProps {
  isOpen: boolean;
  nomorKamar: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const KamarDeleteDialog = ({ isOpen, nomorKamar, isDeleting, onConfirm, onCancel }: KamarDeleteDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
            🗑
          </div>
          <div>
            <p className="font-bold text-dark text-sm">Hapus kamar ini?</p>
            <p className="text-xs text-gray-400">No. {nomorKamar}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">
          Data kamar yang dihapus tidak dapat dikembalikan. Pastikan kamar ini tidak sedang dihuni sebelum menghapus.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="border border-gray-200 text-gray-500 text-sm font-bold px-4 py-2 rounded-lg hover:opacity-80"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isDeleting ? "Menghapus..." : "Ya, hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KamarDeleteDialog;
