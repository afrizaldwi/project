import { Clock, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Kerusakan } from '../../types';

interface Props {
  data: Kerusakan;
  onStatusChange: (id: number, status: 'pending' | 'proses' | 'selesai') => void;
  onDelete: (id: number) => void;
  onImageClick: (url: string) => void;
}

export function KeluhanGridCard({ data, onStatusChange, onDelete, onImageClick }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {data.foto ? (
        <div 
          className="h-40 w-full overflow-hidden cursor-pointer"
          onClick={() => onImageClick(data.foto!)}
        >
          <img src={data.foto} alt="Bukti" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="h-40 w-full bg-gray-50 flex items-center justify-center border-b border-gray-100">
          <span className="text-gray-400 text-xs">Tanpa Foto</span>
        </div>
      )}
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold text-gray-800 text-sm line-clamp-1">{data.judul}</p>
            <p className="text-[11px] text-gray-500">
              {data.nama_penyewa} • Kamar {data.nomor_kamar}
            </p>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 line-clamp-2 flex-1 mb-3">
          {data.deskripsi}
        </p>

        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-3">
          <Clock size={12} />
          {new Date(data.tanggal_lapor).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-gray-50">
          <select
            value={data.status}
            onChange={(e) => onStatusChange(data.id_keluhan, e.target.value as 'pending' | 'proses' | 'selesai')}
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-[10px] rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-transparent block p-1.5 outline-none appearance-none cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="proses">Proses</option>
            <option value="selesai">Selesai</option>
          </select>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(data.id_keluhan)}
            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg shrink-0"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
