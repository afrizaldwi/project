import { KeluhanGridCard } from '../components/keluhan/KeluhanGridCard';
import { KeluhanListRow } from '../components/keluhan/KeluhanListRow';
import type { Kerusakan } from '../types';

export type ViewType = 'list' | 'grid';

interface ViewFactoryProps {
  type: ViewType;
  data: Kerusakan[];
  onStatusChange: (id: number, status: 'pending' | 'proses' | 'selesai') => void;
  onDelete: (id: number) => void;
  onImageClick: (url: string) => void;
}

export const KeluhanViewFactory = ({ type, data, onStatusChange, onDelete, onImageClick }: ViewFactoryProps) => {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 w-full bg-white rounded-xl border border-gray-100">
        Belum ada laporan kerusakan yang masuk.
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map(item => (
          <KeluhanGridCard
            key={item.id_keluhan}
            data={item}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    );
  }

  // Default to List View
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[200px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="py-3 px-4 font-semibold text-gray-600 text-xs">Pelapor</th>
              <th className="py-3 px-4 font-semibold text-gray-600 text-xs">Laporan</th>
              <th className="py-3 px-4 font-semibold text-gray-600 text-xs">Status</th>
              <th className="py-3 px-4 font-semibold text-gray-600 text-xs text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map(item => (
              <KeluhanListRow
                key={item.id_keluhan}
                data={item}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onImageClick={onImageClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
