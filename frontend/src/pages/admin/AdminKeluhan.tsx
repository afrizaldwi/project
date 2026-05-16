import { useState, useEffect } from 'react';
import { Wrench, Trash2, CheckCircle, Clock, X, Loader2 } from 'lucide-react';
import type { Kerusakan } from '../../types';
import { api } from '../../lib/api';
import useAuth from '../../hook/useAuth';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { KeluhanViewFactory, type ViewType } from '../../patterns/ViewFactory';
import { LayoutGrid, List } from 'lucide-react';

export default function AdminKeluhan() {
  const { user } = useAuth();
  const [data, setData] = useState<Kerusakan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('list');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getKeluhan({ role: 'admin' });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: 'pending' | 'proses' | 'selesai') => {
    try {
      await api.updateKeluhanStatus(id, newStatus);
      setData(prev => prev.map(item => item.id_keluhan === id ? { ...item, status: newStatus } : item));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus keluhan ini?')) {
      try {
        await api.deleteKeluhan(id);
        setData(prev => prev.filter(item => item.id_keluhan !== id));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
            Semua Laporan Kerusakan
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Pantau dan kelola seluruh keluhan kerusakan dari penghuni kost.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewType('list')}
            className={`p-1.5 rounded-md transition-colors ${viewType === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewType('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewType === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Factory Content Rendering */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[200px] flex items-center justify-center">
           <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <KeluhanViewFactory 
          type={viewType}
          data={data}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onImageClick={setSelectedImage}
        />
      )}

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          <DialogHeader className="hidden">
            <DialogTitle>View Image</DialogTitle>
            <DialogDescription>Full size preview of damage report</DialogDescription>
          </DialogHeader>
          <div className="relative group">
            <img
              src={selectedImage || ''}
              alt="Enlarged Bukti"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/20 text-white transition-all shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}