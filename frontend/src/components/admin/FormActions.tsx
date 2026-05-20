interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActions = ({ isSubmitting, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={onCancel}
        className="px-8 py-2.5 text-sm font-black text-dark/40 transition-colors hover:text-dark"
      >
        Batal
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-primary px-8 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Penghuni"}
      </button>
    </div>
  );
};

export default FormActions;
