import { Link } from "react-router-dom";

const PenghuniHeader = () => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-black text-dark">Data Penghuni</h1>
        <p className="mt-1 text-sm font-medium text-dark/50">
          Kelola data penghuni Kost Bahagia
        </p>
      </div>

      <Link
        to="/admin/penghuni/tambah"
        className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-accent"
      >
        + Tambah Penghuni
      </Link>
    </div>
  );
};

export default PenghuniHeader;
