import { useCallback, useEffect, useState } from "react";
import kamarService from "../services/kamarService";
import type { Kamar, KamarStats, KamarStatus, PaginationMeta } from "../types";

interface UseKamarParams {
  page: number;
  setPage: (page: number) => void;
  perPage?: number;
  search?: string;
  status?: KamarStatus | "semua";
}

interface UseKamarReturn {
  kamarList: Kamar[];
  stats: KamarStats;
  paginationMeta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deleteKamar: (id: number) => Promise<void>;
}

const defaultStats: KamarStats = {
  total: 0,
  tersedia: 0,
  terisi: 0,
  perbaikan: 0,
};

const useKamar = ({
  page,
  setPage,
  perPage = 10,
  search = "",
  status = "semua",
}: UseKamarParams): UseKamarReturn => {
  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [stats, setStats] = useState<KamarStats>(defaultStats);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await kamarService.getAll({
        page,
        per_page: perPage,
        search,
        status,
      });

      if (result.data.length === 0 && page > 1) {
        setPage(Math.max(1, result.meta.last_page));
        return;
      }

      setKamarList(result.data);
      setPaginationMeta(result.meta);
      setStats({
        total: result.total,
        tersedia: result.tersedia,
        terisi: result.terisi,
        perbaikan: result.perbaikan,
      });
    } catch {
      setError("Gagal memuat data kamar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, search, status]);

  const deleteKamar = useCallback(
    async (id: number) => {
      await kamarService.delete(id);
      await refresh();
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    kamarList,
    stats,
    paginationMeta,
    isLoading,
    error,
    refresh,
    deleteKamar,
  };
};

export default useKamar;
