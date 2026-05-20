interface LaporanKeuanganExportCardProps {
  isLoading: boolean;
  invoiceCount: number;
}

export const LaporanKeuanganExportCard = ({
  isLoading,
  invoiceCount,
}: LaporanKeuanganExportCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-dark">
            Export Laporan Transaksi
          </h2>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Branch Salsa hanya menambahkan output laporan berupa CSV dari
            pembayaran yang sudah diterima. Tampilan tabel, filter periode,
            dan pencatatan pengeluaran akan digabung setelah branch Ima masuk
            ke develop.
          </p>
        </div>

        <div className="rounded-xl bg-light px-4 py-3 text-sm font-black text-dark/50">
          {isLoading
            ? "Memuat data..."
            : `${invoiceCount} transaksi siap diexport`}
        </div>
      </div>
    </div>
  );
};
