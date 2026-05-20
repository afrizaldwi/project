import React, { useEffect, useMemo, useState } from "react";
import keluhanService from "../../services/keluhanService";
import type { Keluhan, KeluhanStatus } from "../../types";

import PenyewaKeluhanHeader from "../../components/penyewa/keluhan/PenyewaKeluhanHeader";
import PenyewaKeluhanForm from "../../components/penyewa/keluhan/PenyewaKeluhanForm";
import PenyewaKeluhanFilter from "../../components/penyewa/keluhan/PenyewaKeluhanFilter";
import PenyewaKeluhanGrid from "../../components/penyewa/keluhan/PenyewaKeluhanGrid";
import ImagePreviewModal from "../../components/keluhan/ImagePreviewModal";

const PenyewaKeluhan = () => {
  const [data, setData] = useState<Keluhan[]>([]);
  const [statusFilter, setStatusFilter] = useState<KeluhanStatus | "semua">("semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      <PenyewaKeluhanHeader isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isFormOpen && (
        <PenyewaKeluhanForm
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
        <PenyewaKeluhanFilter
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <PenyewaKeluhanGrid
          data={filteredData}
          isLoading={isLoading}
          onPreviewImage={setActivePreviewImage}
        />
      </section>

      {activePreviewImage && (
        <ImagePreviewModal
          imageUrl={activePreviewImage}
          onClose={() => setActivePreviewImage(null)}
        />
      )}
    </main>
  );
};

export default PenyewaKeluhan;