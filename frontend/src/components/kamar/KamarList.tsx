import type { Kamar } from "../../types";
import { getKamarStatusDisplay } from "./kamarStatusDisplay";

interface KamarListProps {
  kamarList: Kamar[];
  onEdit: (id: number) => void;
  onDelete: (kamar: { id_kamar: number; nomor_kamar: string }) => void;
}

const KamarList = ({ kamarList, onEdit, onDelete }: KamarListProps) => {
  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="hidden md:table-header-group">
          <tr className="bg-secondary">
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Kamar</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Ukuran</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Fasilitas</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Harga</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {kamarList.map((kamar) => {
            const status = getKamarStatusDisplay(kamar.status_kamar);

            return (
              <tr key={kamar.id_kamar} className="block md:table-row bg-white mb-4 md:mb-0 border md:border-0 border-gray-100 rounded-xl shadow-sm md:shadow-none align-top hover:bg-gray-50 transition">
                <td className="flex justify-between items-center md:table-cell p-4 border-b md:border-none border-gray-50">
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Kamar</span>
                  <p className="font-bold text-dark">No. {kamar.nomor_kamar}</p>
                </td>
                <td className="flex justify-between items-center md:table-cell p-4 border-b md:border-none border-gray-50">
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Ukuran</span>
                  <span className="text-sm text-gray-500">{kamar.luas_kamar}</span>
                </td>
                <td className="flex flex-col items-start md:table-cell p-4 border-b md:border-none border-gray-50">
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">Fasilitas</span>
                  <span className="text-sm text-gray-500">{kamar.fasilitas}</span>
                </td>
                <td className="flex justify-between items-center md:table-cell p-4 border-b md:border-none border-gray-50">
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Harga</span>
                  <span className="font-bold text-primary text-sm">{formatRupiah(kamar.harga_bulanan)}</span>
                </td>
                <td className="flex justify-between items-center md:table-cell p-4 border-b md:border-none border-gray-50">
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Status</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="flex justify-between items-center md:table-cell p-4 border-b md:border-none border-gray-50">
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Aksi</span>
                  <div className="flex flex-row w-full gap-2 md:justify-end">
                    <button
                      onClick={() => onEdit(kamar.id_kamar)}
                      className="flex-1 md:flex-none text-xs font-bold text-primary bg-secondary px-3 py-1.5 rounded-lg hover:opacity-80"
                    >Ubah</button>
                    <button
                      onClick={() => onDelete({ id_kamar: kamar.id_kamar, nomor_kamar: kamar.nomor_kamar })}
                      className="flex-1 md:flex-none text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:opacity-80"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KamarList;
