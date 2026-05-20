import React, { useRef } from "react";

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

interface PenyewaKeluhanFormProps {
  form: {
    judul_keluhan: string;
    deskripsi_keluhan: string;
    foto_kerusakan: File[];
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      judul_keluhan: string;
      deskripsi_keluhan: string;
      foto_kerusakan: File[];
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const PenyewaKeluhanForm = ({
  form,
  setForm,
  onSubmit,
  onCancel,
  isSaving,
}: PenyewaKeluhanFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Form Laporan Kerusakan</h2>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <FormInput
          label="Judul Keluhan"
          value={form.judul_keluhan}
          onChange={(value) =>
            setForm((current) => ({ ...current, judul_keluhan: value }))
          }
          placeholder="Contoh: Lampu kamar mati"
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Deskripsi Keluhan
          </label>
          <textarea
            value={form.deskripsi_keluhan}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                deskripsi_keluhan: event.target.value,
              }))
            }
            rows={4}
            placeholder="Jelaskan kerusakan secara singkat dan jelas"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Foto Kerusakan <span className="text-xs font-normal text-gray-500">(Opsional)</span>
          </label>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  if (file.size > 20 * 1024 * 1024) {
                    alert("Ukuran file maksimal 20MB");
                    event.target.value = "";
                    return;
                  }
                  setForm((current) => {
                    if (current.foto_kerusakan.length >= 3) {
                      alert("Maksimal 3 foto!");
                      return current;
                    }
                    return {
                      ...current,
                      foto_kerusakan: [...current.foto_kerusakan, file],
                    };
                  });
                  event.target.value = "";
                }
              }}
              className="hidden"
            />

            <div className="flex flex-wrap gap-4 mt-2">
              {form.foto_kerusakan.map((file, index) => (
                <div key={index} className="relative mt-2 inline-block">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-32 rounded-lg border border-gray-200 object-cover shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm((current) => ({
                        ...current,
                        foto_kerusakan: current.foto_kerusakan.filter((_, i) => i !== index),
                      }));
                    }}
                    className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md hover:bg-red-600 focus:outline-none cursor-pointer"
                    title="Hapus foto"
                  >
                    ✕
                  </button>
                  <p className="mt-2 text-xs text-gray-500 max-w-32 truncate text-center">
                    {file.name}
                  </p>
                </div>
              ))}

              {form.foto_kerusakan.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-32 w-32 mt-2 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <span className="text-3xl text-gray-400 font-light">+</span>
                  <span className="mt-1 text-xs text-gray-400">Tambah Foto</span>
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Format JPG/PNG, maksimal 20MB per foto. Maksimal 3 foto.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
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
            {isSaving ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PenyewaKeluhanForm;
