import { useCallback, useEffect, useState } from "react";
import adminApi from "../../api/admin";
import type { PaginationMeta, PenghuniItem } from "../../types";
import PenghuniHeader from "../../components/admin/PenghuniHeader";
import PenghuniFilter from "../../components/admin/PenghuniFilter";
import PenghuniCardMobile from "../../components/admin/PenghuniCardMobile";
import PenghuniTableDesktop from "../../components/admin/PenghuniTableDesktop";
import PaginationControls from "../../components/ui/PaginationControls";
import { useNavigate } from "react-router-dom";

type StatusFilter = "aktif" | "selesai";
const PER_PAGE = 10;

const AdminPenghuni = () => {
  const [status, setStatus] = useState<StatusFilter>("aktif");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [penghuni, setPenghuni] = useState<PenghuniItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchPenghuni = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setErrorMessage("");

      const response = await adminApi.getPenghuni({
        page,
        per_page: PER_PAGE,
        search,
        status,
      });
      setPenghuni(response.data);
      setPaginationMeta(response.meta);

      if (response.data.length === 0 && page > 1) {
        setPage(Math.max(1, response.meta.last_page));
        return;
      }
    } catch {
      setErrorMessage("Gagal memuat data penghuni.");
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchPenghuni();
  }, [fetchPenghuni]);

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSelesaikan = async (idSewa: number) => {
    const confirmed = window.confirm(
      "Arsipkan penghuni ini sebagai alumni? Status kamar akan diubah menjadi tersedia."
    );
    if (!confirmed) return;

    try {
      await adminApi.finishSewa(idSewa, new Date().toISOString().slice(0, 10));
      await fetchPenghuni(true);
    } catch {
      alert("Gagal mengarsipkan penghuni.");
    }
  };

  const handlePerpanjang = (idSewa: number) => {
    navigate(`/admin/penghuni/perpanjang/${idSewa}`);
  };

  return (
    <div className="space-y-6 bg-light p-4 md:p-6">
      <PenghuniHeader />

      <PenghuniFilter
        status={status}
        setStatus={handleStatusChange}
        search={search}
        setSearch={handleSearchChange}
      />

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <PenghuniCardMobile
        isLoading={isLoading}
        filteredPenghuni={penghuni}
        handleSelesaikan={handleSelesaikan}
        handlePerpanjang={handlePerpanjang}
      />

      <PenghuniTableDesktop
        isLoading={isLoading}
        filteredPenghuni={penghuni}
        handleSelesaikan={handleSelesaikan}
        handlePerpanjang={handlePerpanjang}
      />

      <PaginationControls
        meta={paginationMeta}
        isLoading={isLoading}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminPenghuni;
