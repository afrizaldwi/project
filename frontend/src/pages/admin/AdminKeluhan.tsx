import { useCallback, useEffect, useMemo, useState } from "react";
import keluhanService from "../../services/keluhanService";
import usePolling from "../../hook/usePolling";
import type { Keluhan, KeluhanStatus, PaginationMeta } from "../../types";

import KeluhanHeader from "../../components/keluhan/KeluhanHeader";
import KeluhanStats from "../../components/keluhan/KeluhanStats";
import KeluhanFilter from "../../components/keluhan/KeluhanFilter";
import KeluhanTable from "../../components/keluhan/KeluhanTable";
import ImagePreviewModal from "../../components/keluhan/ImagePreviewModal";
import PaginationControls from "../../components/ui/PaginationControls";

const POLLING_INTERVAL_MS = 5000;
const PER_PAGE = 10;

const isUnauthorizedError = (error: unknown) => {
  return (error as { response?: { status?: number } })?.response?.status === 401;
};

const AdminKeluhan = () => {
  const [data, setData] = useState<Keluhan[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [keluhanSummary, setKeluhanSummary] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<KeluhanStatus | "semua">("semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const response = await keluhanService.getAdminKeluhan({
        page,
        per_page: PER_PAGE,
        search,
        status: statusFilter,
      });
      setData(response.data);
      setPaginationMeta(response.meta);
      if (response.summary) {
        setKeluhanSummary(response.summary);
      }

      if (response.data.length === 0 && page > 1) {
        setPage(Math.max(1, response.meta.last_page));
        return;
      }
    } catch (error) {
      if (isUnauthorizedError(error) && silent) {
        throw error;
      }

      if (!silent) {
        setError("Gagal memuat laporan kerusakan.");
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  usePolling(() => fetchData(true), {
    enabled: isUpdatingId === null,
    intervalMs: POLLING_INTERVAL_MS,
  });

  const counts = useMemo(() => {
    if (keluhanSummary) {
      return {
        total: keluhanSummary.total ?? 0,
        pending: keluhanSummary.pending ?? 0,
        proses: keluhanSummary.proses ?? 0,
        selesai: keluhanSummary.selesai ?? 0,
      };
    }
    return {
      total: paginationMeta?.total ?? data.length,
      pending: data.filter((item) => item.status_keluhan === "pending").length,
      proses: data.filter((item) => item.status_keluhan === "proses").length,
      selesai: data.filter((item) => item.status_keluhan === "selesai").length,
    };
  }, [data, paginationMeta, keluhanSummary]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: KeluhanStatus | "semua") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleUpdateStatus = async (id: number, status: KeluhanStatus) => {
    setIsUpdatingId(id);
    setError(null);

    try {
      await keluhanService.updateStatus(id, status);
      await fetchData(true);
    } catch {
      setError("Gagal memperbarui status keluhan.");
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus laporan kerusakan ini?")) return;

    setError(null);

    try {
      await keluhanService.deleteKeluhan(id);
      await fetchData(true);
    } catch {
      setError("Gagal menghapus laporan kerusakan.");
    }
  };

  return (
    <main className="space-y-6 p-6">
      <KeluhanHeader />

      <KeluhanStats
        total={counts.total}
        pending={counts.pending}
        proses={counts.proses}
        selesai={counts.selesai}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <KeluhanFilter
          search={search}
          setSearch={handleSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
        />

        <KeluhanTable
          data={data}
          isLoading={isLoading}
          isUpdatingId={isUpdatingId}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
          onPreviewImage={setActivePreviewImage}
        />

        <PaginationControls
          meta={paginationMeta}
          isLoading={isLoading}
          onPageChange={setPage}
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

export default AdminKeluhan;
