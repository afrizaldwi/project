import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hook/useAuth";
import tamuService from "../../services/tamuService";
import type { Tamu } from "../../types";

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

const PenyewaTamu = () => {
  const { user } = useAuth();

  const [data, setData] = useState<Tamu[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nama_tamu: "",
    no_hp_tamu: "",
    keperluan: "",
  });

  const fetchData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const tamu = await tamuService.getPenyewaTamu(user.id);
      setData(tamu);
    } catch {
      setError("Gagal memuat riwayat tamu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((item) => {
      return (
        item.nama_tamu.toLowerCase().includes(keyword) ||
        item.no_hp_tamu.toLowerCase().includes(keyword) ||
        item.keperluan.toLowerCase().includes(keyword)
      );
    });
  }, [data, search]);

  const resetForm = () => {
    setForm({
      nama_tamu: "",
      no_hp_tamu: "",
      keperluan: "",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.nama_tamu || !form.no_hp_tamu || !form.keperluan) {
      setError("Semua field wajib diisi.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await tamuService.createPenyewaTamu(form);
      resetForm();
      setIsFormOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal menyimpan data tamu.");
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
              Buku Tamu
            </p>
            <h1 className="mt-2 text-2xl font-bold">Tamu yang Berkunjung</h1>
            <p className="mt-1 max-w-2xl text-sm text-blue-100">
              Catat dan lihat riwayat tamu yang berkunjung ke kamar Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen((value) => !value)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
          >
            {isFormOpen ? "Tutup Form" : "+ Tambah Tamu"}
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
          <h2 className="text-lg font-bold text-gray-900">Form Tamu Baru</h2>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
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
                {isSaving ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold text-gray-900">Riwayat Tamu</h2>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari tamu atau keperluan..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 md:max-w-xs"
          />
        </div>

        {isLoading ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Memuat riwayat tamu...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Belum ada riwayat tamu.
          </div>
        ) : (
          <div className="mt-5">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl border border-gray-100 lg:block">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Tamu</TableHead>
                    <TableHead>No. HP</TableHead>
                    <TableHead>Keperluan</TableHead>
                    <TableHead>Waktu</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredData.map((item, index) => (
                    <tr key={item.id_tamu} className="hover:bg-gray-50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.nama_tamu}</TableCell>
                      <TableCell>{item.no_hp_tamu}</TableCell>
                      <TableCell>{item.keperluan}</TableCell>
                      <TableCell>{formatTanggal(item.waktu_berkunjung)}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-4 lg:hidden">
              {filteredData.map((item, index) => (
                <article
                  key={item.id_tamu}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-400">#{index + 1}</p>
                    <h3 className="mt-1 font-bold text-gray-900">{item.nama_tamu}</h3>
                    <p className="text-sm text-gray-500">{item.no_hp_tamu}</p>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <InfoItem label="Keperluan" value={item.keperluan} />
                    <InfoItem label="Waktu" value={formatTanggal(item.waktu_berkunjung)} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
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

interface TableTextProps {
  children: React.ReactNode;
}

const TableHead = ({ children }: TableTextProps) => (
  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
    {children}
  </th>
);

const TableCell = ({ children }: TableTextProps) => (
  <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
);

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <p className="mt-1 font-semibold text-gray-900">{value || "-"}</p>
  </div>
);

export default PenyewaTamu;