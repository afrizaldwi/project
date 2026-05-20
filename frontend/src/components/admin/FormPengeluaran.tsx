import { type FormEvent } from "react";

interface FormState {
  judul_pengeluaran: string;
  deskripsi: string;
  jumlah_pengeluaran: string;
  tanggal_pengeluaran: string;
}

interface FormPengeluaranProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const FormPengeluaran = ({
  form,
  setForm,
  isSubmitting,
  onSubmit,
  onCancel,
}: FormPengeluaranProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-black text-dark">
        + Catatan Pengeluaran Baru
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            Tanggal
          </label>
          <input
            type="date"
            value={form.tanggal_pengeluaran}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                tanggal_pengeluaran: event.target.value,
              }))
            }
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            Keterangan
          </label>
          <input
            value={form.judul_pengeluaran}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                judul_pengeluaran: event.target.value,
              }))
            }
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            Jumlah
          </label>
          <input
            type="number"
            min={1}
            value={form.jumlah_pengeluaran}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                jumlah_pengeluaran: event.target.value,
              }))
            }
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-bold text-dark/70">
          Deskripsi
        </label>
        <textarea
          value={form.deskripsi}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              deskripsi: event.target.value,
            }))
          }
          rows={3}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-black text-dark/40 transition-colors hover:text-dark"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default FormPengeluaran;
