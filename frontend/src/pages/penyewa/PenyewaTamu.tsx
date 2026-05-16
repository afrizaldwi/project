import { useState, useEffect, useMemo } from 'react';
import { Search, FileJson, FileSpreadsheet, Clock, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { Tamu } from '../../types';
import { api } from '../../lib/api';
import useAuth from '../../hook/useAuth';

// Shadcn UI Components
import { Button } from "@/components/ui/button";

export default function PenyewaTamu() {
  const { user } = useAuth();
  const [data, setData] = useState<Tamu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.getTamu({ id_user: user.id });
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

  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.nama_tamu.toLowerCase().includes(lowerSearch) ||
        t.no_hp_tamu.includes(lowerSearch) ||
        t.keperluan.toLowerCase().includes(lowerSearch)
      );
    }
    return result;
  }, [data, searchTerm, user]);

  const totalPages = Math.ceil(filteredData.length / pageLimit) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);

  const exportJSON = () => {
    const jsonString = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `riwayat-tamu-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const exportCSV = () => {
    const headers = ['Nama Tamu', 'No HP', 'Keperluan', 'Waktu Berkunjung'];
    const rows = filteredData.map(t => [
      t.nama_tamu, t.no_hp_tamu, t.keperluan, new Date(t.waktu_berkunjung).toLocaleString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `riwayat-tamu-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
            Tamu yang Berkunjung
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Daftar tamu yang tercatat mengunjungi kamar Anda.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-3 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama tamu atau keperluan..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">No. HP Tamu</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Waktu Berkunjung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-100 rounded"></div></td>
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
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                      {t.no_hp_tamu}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-600 text-[10px]">
                        <Clock size={12} className="text-gray-400" />
                        {new Date(t.waktu_berkunjung).toLocaleString('id-ID', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    Belum ada riwayat tamu ditemukan.
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