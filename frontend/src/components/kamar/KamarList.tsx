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
        <thead>
          <tr className="bg-secondary">
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Kamar</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Ukuran</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Fasilitas</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Harga</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-primary uppercase tracking-wide">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {kamarList.map((kamar) => {
            const status = getKamarStatusDisplay(kamar.status_kamar);

            return (
              <tr key={kamar.id_kamar} className="border-t border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <p className="font-bold text-dark">No. {kamar.nomor_kamar}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{kamar.luas_kamar}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{kamar.fasilitas}</td>
                <td className="px-4 py-3 font-bold text-primary text-sm">{formatRupiah(kamar.harga_bulanan)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(kamar.id_kamar)}
                      className="text-xs font-bold text-primary bg-secondary px-3 py-1.5 rounded-lg hover:opacity-80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete({ id_kamar: kamar.id_kamar, nomor_kamar: kamar.nomor_kamar })}
                      className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:opacity-80"
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
