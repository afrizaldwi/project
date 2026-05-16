import { useState, useEffect, useCallback } from "react";
import penghuniService from "../services/penghuniService";

const usePenghuni = () => {
  const [aktif, setAktif] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await penghuniService.getAll();
      setAktif(data.aktif || []);
      setAlumni(data.alumni || []);
    } catch {
      setError("Gagal memuat data penghuni.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: string) => {
    await penghuniService.updateStatus(id, status);
    await refresh();
  }, [refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  return { aktif, alumni, isLoading, error, refresh, updateStatus };
};

export default usePenghuni;