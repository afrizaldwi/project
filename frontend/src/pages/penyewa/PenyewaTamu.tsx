import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hook/useAuth";
import tamuService from "../../services/tamuService";
import type { Tamu } from "../../types";

import PenyewaTamuHeader from "../../components/penyewa/tamu/PenyewaTamuHeader";
import PenyewaTamuForm from "../../components/penyewa/tamu/PenyewaTamuForm";
import PenyewaTamuFilter from "../../components/penyewa/tamu/PenyewaTamuFilter";
import PenyewaTamuTable from "../../components/penyewa/tamu/PenyewaTamuTable";

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
      const tamu = await tamuService.getPenyewaTamu();
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
      <PenyewaTamuHeader isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isFormOpen && (
        <PenyewaTamuForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={() => {
            resetForm();
            setIsFormOpen(false);
          }}
          isSaving={isSaving}
        />
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <PenyewaTamuFilter search={search} setSearch={setSearch} />

        {isLoading ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Memuat riwayat tamu...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Belum ada riwayat tamu.
          </div>
        ) : (
          <PenyewaTamuTable data={filteredData} />
        )}
      </section>
    </main>
  );
};

export default PenyewaTamu;