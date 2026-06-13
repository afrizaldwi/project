import React from "react";

interface FormInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const FormInput = ({ label, value, placeholder, onChange }: FormInputProps) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
    />
  </div>
);

interface PenyewaTamuFormProps {
  form: {
    nama_tamu: string;
    no_hp_tamu: string;
    keperluan: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      nama_tamu: string;
      no_hp_tamu: string;
      keperluan: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const PenyewaTamuForm = ({
  form,
  setForm,
  onSubmit,
  onCancel,
  isSaving,
}: PenyewaTamuFormProps) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Form Tamu Baru</h2>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        <FormInput
          label="Nama Tamu"
          value={form.nama_tamu}
          onChange={(value) => setForm((current) => ({ ...current, nama_tamu: value }))}
          placeholder="Masukkan nama tamu"
        />

        <FormInput
          label="No. HP Tamu"
          value={form.no_hp_tamu}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              no_hp_tamu: value.replace(/\D/g, "").slice(0, 20),
            }))
          }
          placeholder="08xxxxxxxxxx"
        />

        <div className="md:col-span-2">
          <FormInput
            label="Keperluan"
            value={form.keperluan}
            onChange={(value) => setForm((current) => ({ ...current, keperluan: value }))}
            placeholder="Alasan berkunjung"
          />
        </div>

        <div className="flex gap-3 md:col-span-2 md:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PenyewaTamuForm;
