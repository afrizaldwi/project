import { useCallback, useEffect, useMemo, useState } from "react";
import tamuService from "../../services/tamuService";
import type { PaginationMeta, PenghuniAktifOption, Tamu } from "../../types";

import TamuHeader from "../../components/tamu/TamuHeader";
import TamuStats from "../../components/tamu/TamuStats";
import TamuForm from "../../components/tamu/TamuForm";
import TamuFilter from "../../components/tamu/TamuFilter";
import TamuTable from "../../components/tamu/TamuTable";
import TamuMobileCards from "../../components/tamu/TamuMobileCards";
import PaginationControls from "../../components/ui/PaginationControls";

const PER_PAGE = 10;

const AdminTamu = () => {
  const [data, setData] = useState<Tamu[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [tamuSummary, setTamuSummary] = useState<any>(null);
  const [page, setPage] = useState(1);
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

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const response = await tamuService.getAdminTamu({
        page,
        per_page: PER_PAGE,
        search,
      });

      setData(response.data);
      setPaginationMeta(response.meta);
      if (response.summary) {
        setTamuSummary(response.summary);
      }

      if (response.data.length === 0 && page > 1) {
        setPage(Math.max(1, response.meta.last_page));
        return;
      }
    } catch {
      setError("Gagal memuat data tamu.");
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchPenghuniOptions = async () => {
      try {
        const penghuni = await tamuService.getPenghuniAktif();
        setPenghuniOptions(penghuni);
      } catch {
        setError("Gagal memuat data penghuni aktif.");
      }
    };

    fetchPenghuniOptions();
  }, []);

  const resetForm = () => {
    setForm({
      nama_tamu: "",
      no_hp_tamu: "",
      id_user: "",
      keperluan: "",
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
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

      if (page === 1) {
        await fetchData(true);
      } else {
        setPage(1);
      }
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
      await fetchData(true);
    } catch {
      setError("Gagal menghapus data tamu.");
    }
  };

  const stats = useMemo(() => {
    if (tamuSummary) {
      return {
        totalTamu: tamuSummary.total_tamu ?? 0,
        totalPenghuniVisited: tamuSummary.total_penghuni_visited ?? 0,
        tamuToday: tamuSummary.tamu_today ?? 0,
      };
    }
    return {
      totalTamu: paginationMeta?.total ?? data.length,
      totalPenghuniVisited: new Set(data.map((item) => item.id_user)).size,
      tamuToday: data.filter(
        (item) => item.waktu_berkunjung?.slice(0, 10) === new Date().toISOString().slice(0, 10)
      ).length,
    };
  }, [data, paginationMeta, tamuSummary]);

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
        <TamuFilter search={search} setSearch={handleSearchChange} />

        {isLoading ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Memuat data tamu...
          </div>
        ) : data.length === 0 ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Belum ada data tamu.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <TamuTable
              data={data}
              startNumber={paginationMeta?.from ?? 1}
              onDelete={handleDelete}
            />
            <TamuMobileCards
              data={data}
              startNumber={paginationMeta?.from ?? 1}
              onDelete={handleDelete}
            />
          </div>
        )}

        <PaginationControls
          meta={paginationMeta}
          isLoading={isLoading}
          onPageChange={setPage}
        />
      </section>
    </main>
  );
};

export default AdminTamu;
