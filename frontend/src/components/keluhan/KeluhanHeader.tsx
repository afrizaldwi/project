export const KeluhanHeader = () => {
  return (
    <section className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 p-6 text-white shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
          Laporan Kerusakan
        </p>
        <h1 className="mt-2 text-2xl font-bold">Kelola Keluhan Penghuni</h1>
        <p className="mt-1 max-w-2xl text-sm text-blue-100">
          Pantau laporan kerusakan, ubah status perbaikan, dan hapus laporan yang tidak valid.
        </p>
      </div>
    </section>
  );
};

export default KeluhanHeader;
