import { useEffect, useMemo, useState } from "react";
import adminApi from "../../api/admin";
import type { PenghuniItem } from "../../types";
import PenghuniHeader from "../../components/admin/PenghuniHeader";
import PenghuniFilter from "../../components/admin/PenghuniFilter";
import PenghuniCardMobile from "../../components/admin/PenghuniCardMobile";
import PenghuniTableDesktop from "../../components/admin/PenghuniTableDesktop";
import { useNavigate } from "react-router-dom";

type StatusFilter = "aktif" | "selesai";

const AdminPenghuni = () => {
  const [status, setStatus] = useState<StatusFilter>("aktif");
  const [search, setSearch] = useState("");
  const [penghuni, setPenghuni] = useState<PenghuniItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchPenghuni = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await adminApi.getPenghuni(status);
      setPenghuni(data);
    } catch {
      setErrorMessage("Gagal memuat data penghuni.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenghuni();
  }, [status]);

  const filteredPenghuni = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return penghuni;

    return penghuni.filter((item) => {
      const nama = item.user?.nama_lengkap?.toLowerCase() || "";
      const email = item.user?.email?.toLowerCase() || "";
      const kamar = item.kamar?.nomor_kamar?.toLowerCase() || "";
      return nama.includes(keyword) || email.includes(keyword) || kamar.includes(keyword);
    });
  }, [penghuni, search]);

  const handleSelesaikan = async (idSewa: number) => {
    const confirmed = window.confirm(
      "Arsipkan penghuni ini sebagai alumni? Status kamar akan diubah menjadi tersedia."
    );
    if (!confirmed) return;

    try {
      await adminApi.finishSewa(idSewa, new Date().toISOString().slice(0, 10));
      await fetchPenghuni();
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
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <PenghuniCardMobile
        isLoading={isLoading}
        filteredPenghuni={filteredPenghuni}
        handleSelesaikan={handleSelesaikan}
        handlePerpanjang={handlePerpanjang}

      />

      <PenghuniTableDesktop
        isLoading={isLoading}
        filteredPenghuni={filteredPenghuni}
        handleSelesaikan={handleSelesaikan}
        handlePerpanjang={handlePerpanjang}

      />
    </div>
  );
};

export default AdminPenghuni;