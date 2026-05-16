import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Kerusakan } from '../../types';

interface Props {
  data: Kerusakan;
  onStatusChange: (id: number, status: 'pending' | 'proses' | 'selesai') => void;
  onDelete: (id: number) => void;
  onImageClick: (url: string) => void;
}

export function KeluhanListRow({ data, onStatusChange, onDelete, onImageClick }: Props) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-4">
        <p className="font-semibold text-gray-800 text-xs">{data.nama_penyewa}</p>
        <p className="text-[10px] text-gray-500">Kamar {data.nomor_kamar}</p>
      </td>
      <td className="py-3 px-4 max-w-md">
        <div className="flex gap-3">
          {data.foto && (
            <div
              className="shrink-0 w-12 h-12 rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
              onClick={() => onImageClick(data.foto!)}
            >
              <img src={data.foto} alt="Bukti" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800 text-xs">{data.judul}</p>
            <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">{data.deskripsi}</p>
            <p className="text-[9px] text-gray-400 mt-1">
              {new Date(data.tanggal_lapor).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <select
          value={data.status}
          onChange={(e) => onStatusChange(data.id_keluhan, e.target.value as 'pending' | 'proses' | 'selesai')}
          className="bg-gray-50 border border-gray-200 text-gray-800 text-[10px] rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-transparent block p-1.5 outline-none appearance-none cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="proses">Proses</option>
          <option value="selesai">Selesai</option>
        </select>
      </td>
      <td className="py-3 px-4 text-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(data.id_keluhan)}
          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
        >
          <Trash2 size={16} />
        </Button>
      </td>
    </tr>
  );
}
