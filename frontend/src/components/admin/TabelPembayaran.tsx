import type { LaporanKeuanganResponse } from "../../types";

type PembayaranItem = LaporanKeuanganResponse["pembayaran_terbaru"][number];

interface TabelPembayaranProps {
  pembayaran: PembayaranItem[] | undefined;
  formatRupiah: (value: number) => string;
}

const TabelPembayaran = ({ pembayaran, formatRupiah }: TabelPembayaranProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h2 className="text-lg font-black text-dark">Pembayaran Terbaru</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
            <tr>
              <th className="px-5 py-4">Penghuni</th>
              <th className="px-5 py-4">Tanggal</th>
              <th className="px-5 py-4">Jumlah</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pembayaran && pembayaran.length > 0 ? (
              pembayaran.map((item) => (
                <tr key={item.id_pembayaran} className="transition-colors hover:bg-light/70">
                  <td className="px-5 py-4">
                    <p className="font-black text-dark">{item.nama_lengkap || "-"}</p>
                    <p className="text-xs font-medium text-dark/40">
                      {item.kode_invoice || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-medium text-dark/70">
                    {item.tanggal_bayar}
                  </td>

                  <td className="px-5 py-4 font-black text-success">
                    {formatRupiah(Number(item.jumlah_bayar))}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-success/10 px-3 py-1 text-[10px] font-black uppercase text-success">
                      {item.status_verifikasi}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={4}>
                  Belum ada pembayaran pada periode ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelPembayaran;
