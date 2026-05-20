import { useCallback, useEffect, useState } from "react";
import kamarService from "../services/kamarService";
import type { Kamar, KamarStats } from "../types";

interface UseKamarReturn {
  kamarList: Kamar[];
  stats: KamarStats;
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

const useKamar = (): UseKamarReturn => {
  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [stats, setStats] = useState<KamarStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await kamarService.getAll();

      setKamarList(result.data);
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
  }, []);

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
    isLoading,
    error,
    refresh,
    deleteKamar,
  };
};

export default useKamar;