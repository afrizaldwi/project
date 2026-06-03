import { useCallback, useEffect, useMemo, useState } from "react";
import keluhanService from "../../services/keluhanService";
import usePolling from "../../hook/usePolling";
import type { Keluhan, KeluhanStatus } from "../../types";

import KeluhanHeader from "../../components/keluhan/KeluhanHeader";
import KeluhanStats from "../../components/keluhan/KeluhanStats";
import KeluhanFilter from "../../components/keluhan/KeluhanFilter";
import KeluhanTable from "../../components/keluhan/KeluhanTable";
import ImagePreviewModal from "../../components/keluhan/ImagePreviewModal";

const POLLING_INTERVAL_MS = 5000;

const isUnauthorizedError = (error: unknown) => {
  return (error as { response?: { status?: number } })?.response?.status === 401;
};

const AdminKeluhan = () => {
  const [data, setData] = useState<Keluhan[]>([]);
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
      const keluhan = await keluhanService.getAdminKeluhan(statusFilter);
      setData(keluhan);
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
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  usePolling(() => fetchData(true), {
    enabled: isUpdatingId === null,
    intervalMs: POLLING_INTERVAL_MS,
  });

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((item) => {
      return (
        item.judul_keluhan.toLowerCase().includes(keyword) ||
        item.deskripsi_keluhan.toLowerCase().includes(keyword) ||
        item.nama_penghuni.toLowerCase().includes(keyword) ||
        item.nomor_kamar.toLowerCase().includes(keyword)
      );
    });
  }, [data, search]);

  const counts = useMemo(() => {
    return {
      total: data.length,
      pending: data.filter((item) => item.status_keluhan === "pending").length,
      proses: data.filter((item) => item.status_keluhan === "proses").length,
      selesai: data.filter((item) => item.status_keluhan === "selesai").length,
    };
  }, [data]);

  const handleUpdateStatus = async (id: number, status: KeluhanStatus) => {
    setIsUpdatingId(id);
    setError(null);

    try {
      const updated = await keluhanService.updateStatus(id, status);

      setData((current) =>
        current.map((item) => (item.id_keluhan === id ? updated : item))
      );
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
      setData((current) => current.filter((item) => item.id_keluhan !== id));
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
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <KeluhanTable
          data={filteredData}
          isLoading={isLoading}
          isUpdatingId={isUpdatingId}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
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

export default AdminKeluhan;