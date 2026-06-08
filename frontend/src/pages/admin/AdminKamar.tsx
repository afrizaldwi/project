import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useKamar from "../../hook/useKamar";
import KamarFilters from "../../components/kamar/KamarFilters";
import KamarGrid from "../../components/kamar/KamarGrid";
import KamarList from "../../components/kamar/KamarList";
import KamarDeleteDialog from "../../components/kamar/KamarDeleteDialog";
import { kamarStatusDisplay } from "../../components/kamar/kamarStatusDisplay";
import PaginationControls from "../../components/ui/PaginationControls";
import type { KamarStatus } from "../../types";

const PER_PAGE = 10;

type KamarStatusFilter = KamarStatus | "semua";

const AdminKamar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<KamarStatusFilter>("semua");
  const [page, setPage] = useState(1);
  const { kamarList, stats, paginationMeta, isLoading, error, deleteKamar } = useKamar({
    page,
    setPage,
    perPage: PER_PAGE,
    search,
    status: filterStatus,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteTarget, setDeleteTarget] = useState<{
    id_kamar: number;
    nomor_kamar: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: KamarStatusFilter) => {
    setFilterStatus(value);
    setPage(1);
  };



  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteKamar(deleteTarget.id_kamar);
      setDeleteTarget(null);
    } catch (err: any) {
      setDeleteTarget(null);
      alert(err?.response?.data?.message || "Gagal menghapus kamar.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-light p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Data Kamar</h1>
        </div>

        <Link
          to="/admin/kamar/tambah"
          className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-accent"
        >
          + Tambah Kamar
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Kamar", value: stats.total, color: "text-dark" },
          { label: kamarStatusDisplay.tersedia.label, value: stats.tersedia, color: kamarStatusDisplay.tersedia.textClassName },
          { label: kamarStatusDisplay.terisi.label, value: stats.terisi, color: kamarStatusDisplay.terisi.textClassName },
          { label: kamarStatusDisplay.perbaikan.label, value: stats.perbaikan, color: kamarStatusDisplay.perbaikan.textClassName },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-5 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{isLoading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-5">
        <KamarFilters
          search={search}
          filterStatus={filterStatus}
          viewMode={viewMode}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center flex-1 py-20">
          <p className="text-gray-400 text-sm">Memuat data kamar...</p>
        </div>
      ) : kamarList.length === 0 ? (
        <div className="flex items-center justify-center flex-1 py-20">
          <p className="text-gray-400 text-sm">Tidak ada kamar yang ditemukan.</p>
        </div>
      ) : viewMode === "grid" ? (
        <KamarGrid
          kamarList={kamarList}
          onEdit={(id) => navigate(`/admin/kamar/edit/${id}`)}
          onDelete={setDeleteTarget}
        />
      ) : (
        <KamarList
          kamarList={kamarList}
          onEdit={(id) => navigate(`/admin/kamar/edit/${id}`)}
          onDelete={setDeleteTarget}
        />
      )}

      <PaginationControls
        meta={paginationMeta}
        isLoading={isLoading}
        onPageChange={setPage}
      />

      {/* Delete Dialog */}
      <KamarDeleteDialog
        isOpen={!!deleteTarget}
        nomorKamar={deleteTarget?.nomor_kamar || ""}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminKamar;
