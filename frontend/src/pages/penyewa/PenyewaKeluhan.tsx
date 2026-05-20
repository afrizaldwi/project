import React, { useEffect, useMemo, useState, useRef } from "react";
import keluhanService from "../../services/keluhanService";
import type { Keluhan, KeluhanStatus } from "../../types";

const statusOptions: Array<KeluhanStatus | "semua"> = [
  "semua",
  "pending",
  "proses",
  "selesai",
];

const statusLabel: Record<KeluhanStatus | "semua", string> = {
  semua: "Semua",
  pending: "Pending",
  proses: "Diproses",
  selesai: "Selesai",
};

const statusClass: Record<KeluhanStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  proses: "bg-blue-50 text-blue-700 border-blue-200",
  selesai: "bg-green-50 text-green-700 border-green-200",
};

const getStorageBaseUrl = () => {
  return (import.meta.env.VITE_STORAGE_URL || "http://localhost:8000").replace(/\/$/, "");
};

const getStorageUrl = (path?: string | null) => {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
      .replace("http://kost-nginx", getStorageBaseUrl())
      .replace("https://kost-nginx", getStorageBaseUrl())
      .replace("http://localhost/storage", `${getStorageBaseUrl()}/storage`);
  }

  return `${getStorageBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
};

const formatTanggal = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const PenyewaKeluhan = () => {
  const [data, setData] = useState<Keluhan[]>([]);
  const [statusFilter, setStatusFilter] = useState<KeluhanStatus | "semua">("semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    judul_keluhan: "",
    deskripsi_keluhan: "",
    foto_kerusakan: [] as File[],
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const keluhan = await keluhanService.getPenyewaKeluhan(statusFilter);
      setData(keluhan);
    } catch {
      setError("Gagal memuat laporan kerusakan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((item) => {
      return (
        item.judul_keluhan.toLowerCase().includes(keyword) ||
        item.deskripsi_keluhan.toLowerCase().includes(keyword) ||
        item.status_keluhan.toLowerCase().includes(keyword)
      );
    });
  }, [data, search]);

  const resetForm = () => {
    setForm({
      judul_keluhan: "",
      deskripsi_keluhan: "",
      foto_kerusakan: [],
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.judul_keluhan || !form.deskripsi_keluhan) {
      setError("Judul dan deskripsi keluhan wajib diisi.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await keluhanService.createKeluhan(form);
      resetForm();
      setIsFormOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal mengirim laporan kerusakan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="space-y-6 p-6">
      <section className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Laporan Kerusakan
            </p>
            <h1 className="mt-2 text-2xl font-bold">Keluhan Kamar Saya</h1>
            <p className="mt-1 max-w-2xl text-sm text-blue-100">
              Laporkan kerusakan fasilitas kamar dan pantau status perbaikannya.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen((value) => !value)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
          >
            {isFormOpen ? "Tutup Form" : "+ Buat Laporan"}
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isFormOpen && (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Form Laporan Kerusakan</h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                        className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md hover:bg-red-600 focus:outline-none"
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
                      className="flex h-32 w-32 mt-2 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-500 transition-colors"
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
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isSaving ? "Mengirim..." : "Kirim Laporan"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Riwayat Laporan</h2>
            <p className="text-sm text-gray-500">
              Anda hanya dapat melihat laporan dari sewa aktif milik Anda.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari laporan..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-72"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as KeluhanStatus | "semua")
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Memuat laporan kerusakan...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Belum ada laporan kerusakan.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredData.map((item) => (
              <article
                key={item.id_keluhan}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.judul_keluhan}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatTanggal(item.tanggal_lapor)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[item.status_keluhan]
                      }`}
                  >
                    {statusLabel[item.status_keluhan]}
                  </span>
                </div>

                <p className="mt-4 text-sm text-gray-600">{item.deskripsi_keluhan}</p>

                <div className="mt-4 text-xs text-gray-500">
                  <p>Kamar: {item.nomor_kamar}</p>
                  <p>Selesai: {formatTanggal(item.tanggal_selesai)}</p>
                </div>

                {item.foto_kerusakan && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.foto_kerusakan.split(",").map((path, idx) => {
                      const url = getStorageUrl("/storage/" + path.trim());
                      return url ? (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePreviewImage(url)}
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        >
                          Lihat Foto {idx + 1}
                        </button>
                      ) : null;
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Image Preview Modal */}
      {activePreviewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setActivePreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActivePreviewImage(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white shadow-md hover:bg-black/75 transition-colors focus:outline-none z-10 text-xs font-bold"
              title="Tutup"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={activePreviewImage}
              alt="Preview Kerusakan"
              className="max-w-full max-h-[80vh] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
};

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

export default PenyewaKeluhan;