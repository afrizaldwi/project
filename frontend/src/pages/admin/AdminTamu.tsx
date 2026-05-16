import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, FileJson, FileSpreadsheet, Users, Clock, Loader2, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { Tamu, Kamar } from '../../types';
import { api } from '../../lib/api';
import useAuth from '../../hook/useAuth';

// Shadcn UI Components
import { Button } from "@/components/ui/button";

export default function AdminTamu() {
  const { user } = useAuth();
  const role = user?.role || 'admin';

  const [data, setData] = useState<Tamu[]>([]);
  const [kamarTerisi, setKamarTerisi] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hpError, setHpError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nama_tamu: '',
    no_hp_tamu: '',
    id_user: '',
    keperluan: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tamuRes, kamarRes] = await Promise.all([
        api.getTamu(),
        api.getKamarTerisi()
      ]);
      setData(tamuRes.data);
      setKamarTerisi(kamarRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      alert('Gagal mengambil data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.nama_tamu.toLowerCase().includes(lowerSearch) ||
        t.no_hp_tamu.includes(lowerSearch) ||
        t.nomor_kamar.includes(lowerSearch) ||
        t.keperluan.toLowerCase().includes(lowerSearch)
      );
    }
    return result;
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageLimit) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);

  // Aggressive Enforcement
  useEffect(() => {
    if (formData.no_hp_tamu.length > 12) {
      setFormData(prev => ({ ...prev, no_hp_tamu: prev.no_hp_tamu.slice(0, 12) }));
    }
  }, [formData.no_hp_tamu]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_tamu || !formData.no_hp_tamu || !formData.id_user || !formData.keperluan) {
      alert("Semua field harus diisi!");
      return;
    }

    setIsSaving(true);
    try {
      await api.createTamu({
        nama_tamu: formData.nama_tamu,
        no_hp_tamu: formData.no_hp_tamu,
        id_user: formData.id_user,
        keperluan: formData.keperluan
      });

      setIsFormOpen(false);
      setFormData({ nama_tamu: '', no_hp_tamu: '', id_user: '', keperluan: '' });
      setHpError('');
      fetchData(); // Refresh data
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data tamu ini?')) return;

    try {
      await api.deleteTamu(id);
      setData(data.filter(t => t.id_tamu !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Terjadi kesalahan saat menghapus data');
    }
  };

  const exportJSON = () => {
    const jsonString = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-tamu-admin-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const exportCSV = () => {
    const headers = ['Nama', 'No HP', 'Kamar', 'Keperluan', 'Jam Masuk', 'Bertemu Dengan'];
    const rows = filteredData.map(t => [
      t.nama_tamu, t.no_hp_tamu, t.nomor_kamar, t.keperluan, new Date(t.waktu_berkunjung).toLocaleString(), t.nama_penghuni
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-tamu-admin-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-1rem md:1rem font-extrabold text-gray-800 tracking-tight">
            Data Semua Tamu
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Kelola dan pantau aktivitas kunjungan tamu di seluruh kost.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setHpError('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg gap-1.5 shadow-sm px-3"
          >
            <Plus size={16} />
            <span>Tambah Tamu</span>
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Form Pelaporan Tamu Baru
          </h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.nama_tamu}
                onChange={e => setFormData({ ...formData, nama_tamu: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-sm text-gray-800"
                placeholder="Masukkan nama tamu"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600">No. Handphone</label>
              <input
                type="tel"
                required
                value={formData.no_hp_tamu}
                maxLength={12}
                onKeyDown={e => {
                  console.log("Key Pressed:", e.key, "Current Length:", formData.no_hp_tamu.length);
                  // Allow navigation and control keys
                  if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
                    return;
                  }

                  // Allow Ctrl+A, Ctrl+C, Ctrl+V, etc.
                  if (e.ctrlKey || e.metaKey) {
                    return;
                  }

                  // Block non-digit keys
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                    return;
                  }

                  // Block if length already 12 and no text is selected for replacement
                  const target = e.target as HTMLInputElement;
                  if (formData.no_hp_tamu.length >= 12 && target.selectionStart === target.selectionEnd) {
                    e.preventDefault();
                    console.warn("Input Blocked: 12 digits reached");
                    setHpError('Maksimal 12 digit!');
                    setTimeout(() => setHpError(''), 2000);
                  }
                }}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                  console.log("Setting HP to:", val);
                  setFormData(prev => ({ ...prev, no_hp_tamu: val }));
                  if (val.length < 12) setHpError('');
                }}
                className={`w-full px-4 py-2.5 rounded-xl border ${hpError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 ${hpError ? 'focus:ring-red-500' : 'focus:ring-blue-600'} focus:border-transparent transition-all outline-none text-sm text-gray-800`}
                placeholder="08xxxxxxxxxx"
              />
              <div className="flex justify-between items-center px-1">
                {hpError ? (
                  <p className="text-[10px] text-red-500 font-medium animate-pulse">
                    {hpError}
                  </p>
                ) : (
                  <span className="text-[10px] text-gray-400">Gunakan format angka saja</span>
                )}
                <span className={`text-[9px] font-mono ${formData.no_hp_tamu.length === 12 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                  {formData.no_hp_tamu.length}/12
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600">Tujuan Kamar / Penghuni</label>
              <select
                required
                value={formData.id_user}
                onChange={(e) => setFormData({ ...formData, id_user: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none appearance-none text-sm text-gray-800"
              >
                <option value="">Pilih Kamar / Penghuni</option>
                {kamarTerisi.map(k => (
                  <option key={k.id_user} value={k.id_user.toString()}>
                    Kamar {k.nomor_kamar} - {k.penghuni}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600">Keperluan</label>
              <input
                type="text"
                required
                value={formData.keperluan}
                onChange={e => setFormData({ ...formData, keperluan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-sm text-gray-800"
                placeholder="Alasan berkunjung"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsFormOpen(false);
                  setHpError('');
                }}
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
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Data'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-3 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama, no hp, atau kamar..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            maxLength={20}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-xs text-gray-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={exportJSON}
            className="flex-1 md:flex-none bg-blue-50 hover:bg-blue-100 text-blue-800 border-none rounded-lg gap-1.5 h-9"
          >
            <FileJson size={16} />
            <span className="hidden sm:inline">Export JSON</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="flex-1 md:flex-none bg-blue-50 hover:bg-blue-100 text-blue-800 border-none rounded-lg gap-1.5 h-9"
          >
            <FileSpreadsheet size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Tamu</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keperluan</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bertemu</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kamar</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Waktu</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4 text-center"><div className="h-8 w-8 bg-gray-100 rounded-full mx-auto"></div></td>
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((t, index) => (
                  <tr key={t.id_tamu} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 text-xs text-gray-500 font-medium">
                      {(currentPage - 1) * pageLimit + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                          {t.nama_tamu.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-800 text-xs">{t.nama_tamu}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                        {t.keperluan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-gray-700">{t.nama_penghuni}</div>
                      <div className="text-[9px] text-gray-400 font-mono italic">{t.no_hp_tamu}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-xs font-bold text-gray-700">{t.nomor_kamar}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-600 text-[10px]">
                        <Clock size={12} className="text-gray-400" />
                        {new Date(t.waktu_berkunjung).toLocaleString('id-ID', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(t.id_tamu)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                    Belum ada data tamu ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            Menampilkan
            <select
              value={pageLimit}
              onChange={(e) => {
                setPageLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-600"
            >
              {[5, 10, 25, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            dari <span className="font-semibold text-gray-700">{filteredData.length}</span> data
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 text-gray-500 rounded-lg"
            >
              <ChevronsLeft size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 text-gray-500 rounded-lg"
            >
              <ChevronLeft size={18} />
            </Button>

            <div className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">
              Hal {currentPage} / {totalPages}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 text-gray-500 rounded-lg"
            >
              <ChevronRight size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 text-gray-500 rounded-lg"
            >
              <ChevronsRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}