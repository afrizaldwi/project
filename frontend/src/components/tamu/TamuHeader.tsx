import React from "react";

interface TamuHeaderProps {
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TamuHeader = ({ isFormOpen, setIsFormOpen }: TamuHeaderProps) => {
  return (
    <section className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 p-6 text-white shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
            Buku Tamu
          </p>
          <h1 className="mt-2 text-2xl font-bold">Data Semua Tamu</h1>
          <p className="mt-1 max-w-2xl text-sm text-blue-100">
            Kelola dan pantau aktivitas kunjungan tamu di seluruh kost.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((value) => !value)}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50 cursor-pointer"
        >
          {isFormOpen ? "Tutup Form" : "+ Tambah Tamu"}
        </button>
      </div>
    </section>
  );
};

export default TamuHeader;
