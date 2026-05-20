import React from "react";
import type { PenghuniAktifOption } from "../../types";

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

interface TamuFormProps {
  form: {
    nama_tamu: string;
    no_hp_tamu: string;
    id_user: string;
    keperluan: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    nama_tamu: string;
    no_hp_tamu: string;
    id_user: string;
    keperluan: string;
  }>>;
  penghuniOptions: PenghuniAktifOption[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const TamuForm = ({
  form,
  setForm,
  penghuniOptions,
  onSubmit,
  onCancel,
  isSaving,
}: TamuFormProps) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Form Pelaporan Tamu Baru</h2>

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

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Tujuan Penghuni
          </label>
          <select
            value={form.id_user}
            onChange={(event) =>
              setForm((current) => ({ ...current, id_user: event.target.value }))
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Pilih penghuni aktif</option>
            {penghuniOptions.map((penghuni) => (
              <option key={penghuni.id_user} value={penghuni.id_user}>
                Kamar {penghuni.nomor_kamar} - {penghuni.nama_penghuni}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Keperluan"
          value={form.keperluan}
          onChange={(value) => setForm((current) => ({ ...current, keperluan: value }))}
          placeholder="Alasan berkunjung"
        />

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

export default TamuForm;
