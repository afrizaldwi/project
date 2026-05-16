import { useState, useEffect, useRef } from 'react';
import { Plus, Wrench, Image as ImageIcon, CheckCircle, Clock, X, Loader2 } from 'lucide-react';
import type { Kerusakan } from '../../types';
import { api } from '../../lib/api';
import useAuth from '../../hook/useAuth';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function PenyewaKeluhan() {
  const { user } = useAuth();
  const [data, setData] = useState<Kerusakan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    foto: null as File | null,
    fotoPreview: '' as string
  });

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.getKeluhan({ id_user: user.id, role: 'penyewa' });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        foto: file,
        fotoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.judul || !formData.deskripsi) {
      alert("Kategori dan deskripsi harus diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('id_user', user.id.toString());
      fd.append('judul', formData.judul);
      fd.append('deskripsi', formData.deskripsi);
      if (formData.foto) {
        fd.append('foto', formData.foto);
      }

      await api.createKeluhan(fd);
      setIsFormOpen(false);
      setFormData({ judul: '', deskripsi: '', foto: null, fotoPreview: '' });
      fetchData(); // Refresh list
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1"><Clock size={12} /> Pending</Badge>;
      case 'proses':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><Wrench size={12} /> Proses</Badge>;
      case 'selesai':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1"><CheckCircle size={12} /> Selesai</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
            Laporan Kerusakan Saya
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Kirim dan pantau status laporan kerusakan di kamar Anda.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg gap-1.5 shadow-sm px-3"
        >
          <Plus size={16} />
          <span>Buat Laporan</span>
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Wrench size={20} className="text-blue-600" />
            Kirim Laporan Kerusakan Baru
          </h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-600">Kategori Kerusakan</label>
              <select
                required
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none appearance-none text-sm text-gray-800"
              >
                <option value="">Pilih Kategori</option>
                <option value="Kerusakan AC">AC</option>
                <option value="Gangguan Listrik">Listrik</option>
                <option value="Masalah Air">Air</option>
                <option value="Kerusakan Kamar Mandi">Kamar Mandi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-600">Deskripsi Lengkap</label>
              <textarea
                required
                rows={3}
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-gray-800 resize-none text-sm"
                placeholder="Ceritakan detail kerusakan yang terjadi..."
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-600">Foto Pendukung (Opsional)</label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${formData.fotoPreview ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}`}
                onClick={() => !formData.fotoPreview && fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {formData.fotoPreview ? (
                  <div className="relative inline-block">
                    <img src={formData.fotoPreview} alt="Preview" className="max-h-48 rounded-lg shadow-sm" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, foto: null, fotoPreview: '' }); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors h-6 w-6 flex items-center justify-center shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm">Klik untuk upload foto kerusakan</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl"
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : 'Kirim Laporan'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[200px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-3 px-4 font-semibold text-gray-600 text-xs">Laporan</th>
                <th className="py-3 px-4 font-semibold text-gray-600 text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex gap-4">
                        <div className="shrink-0 w-16 h-16 rounded-lg bg-gray-100"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="h-8 w-24 bg-gray-100 rounded-lg"></div></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-gray-500">
                    Anda belum pernah mengirim laporan kerusakan.
                  </td>
                </tr>
              ) : (
                data.map(k => (
                  <tr key={k.id_keluhan} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 max-w-md">
                      <div className="flex gap-3">
                        {k.foto && (
                          <div
                            className="shrink-0 w-12 h-12 rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                            onClick={() => setSelectedImage(k.foto!)}
                          >
                            <img src={k.foto} alt="Bukti" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{k.judul}</p>
                          <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">{k.deskripsi}</p>
                          <p className="text-[9px] text-gray-400 mt-1">
                            {new Date(k.tanggal_lapor).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(k.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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