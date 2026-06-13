import type { PaginationMeta } from "../../types";

interface PaginationControlsProps {
  meta: PaginationMeta | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({
  meta,
  isLoading = false,
  onPageChange,
}: PaginationControlsProps) => {
  if (!meta) return null;

  const isFirstPage = meta.current_page <= 1;
  const isLastPage = meta.current_page >= meta.last_page;

  const getPageNumbers = () => {
    const totalPages = meta.last_page;
    const current = meta.current_page;

    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (current >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", current - 2, current - 1, current, current + 1, current + 2, "...", totalPages];
  };

  const buttonClass = "rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50";
  const getPageButtonClass = (page: number | string) => {
    if (page === meta.current_page) {
      return `${buttonClass} bg-primary text-white border-primary hover:bg-primary/90`;
    }
    if (page === "...") {
      return "px-2 py-2 text-xs font-bold text-gray-500";
    }
    return `${buttonClass} text-gray-600 bg-white hover:bg-gray-50`;
  };

  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-semibold text-center sm:text-left">
        Menampilkan {meta.from || 0} - {meta.to || 0} dari {meta.total} data
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={isLoading || isFirstPage}
          className={`${buttonClass} text-gray-600 bg-white hover:bg-gray-50 hidden sm:block`}
        >
          {"<<"}
        </button>

        <button
          type="button"
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={isLoading || isFirstPage}
          className={`${buttonClass} text-gray-600 bg-white hover:bg-gray-50`}
        >
          {"<"}
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => typeof page === "number" ? onPageChange(page) : null}
              disabled={isLoading || page === "..."}
              className={getPageButtonClass(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <span className="sm:hidden text-xs font-bold text-gray-500 mx-2">
          {meta.current_page} / {meta.last_page}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={isLoading || isLastPage}
          className={`${buttonClass} text-gray-600 bg-white hover:bg-gray-50`}
        >
          {">"}
        </button>

        <button
          type="button"
          onClick={() => onPageChange(meta.last_page)}
          disabled={isLoading || isLastPage}
          className={`${buttonClass} text-gray-600 bg-white hover:bg-gray-50 hidden sm:block`}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
