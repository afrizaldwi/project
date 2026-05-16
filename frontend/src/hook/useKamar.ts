/**
 * useKamar — Observer Pattern
 * Custom hook sebagai pusat state kamar.
 * Setiap komponen yang memakainya akan reaktif saat data berubah
 * (stat card, grid kartu, dll terupdate otomatis).
 */

import { useState, useEffect, useCallback } from "react";
import kamarService from "../services/kamarService";
import type { Kamar, KamarStats } from "../types/kamar";

interface UseKamarReturn {
  kamarList: Kamar[];
  stats: KamarStats;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deleteKamar: (id: number) => Promise<void>;
}

const useKamar = (): UseKamarReturn => {
  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [stats, setStats] = useState<KamarStats>({ total: 0, tersedia: 0, terisi: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      });
    } catch {
      setError("Gagal memuat data kamar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteKamar = useCallback(async (id: number) => {
    await kamarService.delete(id);
    // Observer: panggil refresh agar semua komponen yang subscribe ikut update
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { kamarList, stats, isLoading, error, refresh, deleteKamar };
};

export default useKamar;