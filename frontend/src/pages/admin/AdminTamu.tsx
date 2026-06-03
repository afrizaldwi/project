import { useEffect, useMemo, useState } from "react";
import tamuService from "../../services/tamuService";
import type { PenghuniAktifOption, Tamu } from "../../types";

import TamuHeader from "../../components/tamu/TamuHeader";
import TamuStats from "../../components/tamu/TamuStats";
import TamuForm from "../../components/tamu/TamuForm";
import TamuFilter from "../../components/tamu/TamuFilter";
import TamuTable from "../../components/tamu/TamuTable";
import TamuMobileCards from "../../components/tamu/TamuMobileCards";

const AdminTamu = () => {
  const [data, setData] = useState<Tamu[]>([]);
  const [penghuniOptions, setPenghuniOptions] = useState<PenghuniAktifOption[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nama_tamu: "",
    no_hp_tamu: "",
    id_user: "",
    keperluan: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [tamu, penghuni] = await Promise.all([
        tamuService.getAdminTamu(),
        tamuService.getPenghuniAktif(),
      ]);

      setData(tamu);
      setPenghuniOptions(penghuni);
    } catch {
      setError("Gagal memuat data tamu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((item) => {
      return (
        item.nama_tamu.toLowerCase().includes(keyword) ||
        item.no_hp_tamu.toLowerCase().includes(keyword) ||
        item.nama_penghuni.toLowerCase().includes(keyword) ||
        item.nomor_kamar.toLowerCase().includes(keyword) ||
        item.keperluan.toLowerCase().includes(keyword)
      );
    });
  }, [data, search]);

  const resetForm = () => {
    setForm({
      nama_tamu: "",
      no_hp_tamu: "",
      id_user: "",
      keperluan: "",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.nama_tamu || !form.no_hp_tamu || !form.id_user || !form.keperluan) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await tamuService.createAdminTamu(form);
      resetForm();
      setIsFormOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal menyimpan data tamu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data tamu ini?")) return;

    try {
      await tamuService.deleteTamu(id);
      setData((current) => current.filter((item) => item.id_tamu !== id));
    } catch {
      setError("Gagal menghapus data tamu.");
    }
  };

  const stats = useMemo(() => {
    return {
      totalTamu: data.length,
      totalPenghuniVisited: new Set(data.map((item) => item.id_user)).size,
      tamuToday: data.filter(
        (item) => item.waktu_berkunjung?.slice(0, 10) === new Date().toISOString().slice(0, 10)
      ).length,
    };
  }, [data]);

  return (
    <main className="space-y-6 p-6">
      <TamuHeader isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />

      <TamuStats
        totalTamu={stats.totalTamu}
        totalPenghuniVisited={stats.totalPenghuniVisited}
        tamuToday={stats.tamuToday}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isFormOpen && (
        <TamuForm
          form={form}
          setForm={setForm}
          penghuniOptions={penghuniOptions}
          onSubmit={handleSubmit}
          onCancel={() => {
            resetForm();
            setIsFormOpen(false);
          }}
          isSaving={isSaving}
        />
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <TamuFilter search={search} setSearch={setSearch} />

        {isLoading ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Memuat data tamu...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Belum ada data tamu.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <TamuTable data={filteredData} onDelete={handleDelete} />
            <TamuMobileCards data={filteredData} onDelete={handleDelete} />
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminTamu;