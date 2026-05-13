import { useState, type FC } from 'react';
import { useInvoices } from '../../hook/useInvoices';
import { 
  RefreshCcw,
  ArrowLeft,
  Download
} from 'lucide-react';
import { BillingCardFactory } from '../../components/factories/BillingCardFactory';

const AdminTagihan: FC = () => {
  const { billings, history, summary, filter, setFilter, generatePDF } = useInvoices();
  const [currentView, setCurrentView] = useState<'management' | 'history'>('management');


  if (currentView === 'history') {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Daftar Pembayaran</h1>
          <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
             <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">A</span> Administrator
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-600 font-medium">
            Notifikasi H-7 & WA aktif — tagihan jatuh tempo dalam 7 hari akan dikirim otomatis via WhatsApp.
          </p>
        </div>

        <button 
          onClick={() => setCurrentView('management')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
        >
          <ArrowLeft size={18} /> Kembali ke Tagihan
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Riwayat Transaksi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">INVOICE</th>
                  <th className="px-6 py-4">PENYEWA</th>
                  <th className="px-6 py-4">JUMLAH</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{h.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{h.penyewa}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">Rp {h.jumlah.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold lowercase italic text-slate-500">{h.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {h.status === 'diterima' ? (
                        <button 
                          onClick={() => generatePDF(h)}
                          className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 mx-auto"
                        >
                          <Download size={14}/> PDF
                        </button>
                      ) : (
                        <button className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors">
                          Verifikasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#2d3748] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-5xl font-bold mb-1">{summary.total}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Tagihan</p>
          </div>
        </div>
        
        <div className="bg-[#10b981] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-5xl font-bold mb-1">{summary.lunas}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">Lunas</p>
          </div>
        </div>

        <div className="bg-[#e11d48] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-5xl font-bold mb-1">{summary.belumBayar}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-100">Belum Bayar</p>
          </div>
        </div>

        <div className="bg-[#f59e0b] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-5xl font-bold mb-1">{summary.menunggu}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-100">Menunggu</p>
          </div>
        </div>
      </div>
      {/* Management Grid Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Manajemen Tagihan</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Status hunian dan validasi bukti bayar secara adaptif</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-slate-100 p-1 rounded-xl shadow-sm">
              <button 
                onClick={() => setFilter('semua')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'semua' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setFilter('validasi')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'validasi' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Validasi
              </button>
            </div>
            <button className="p-2.5 bg-white border border-slate-100 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>

        {/* FACTORY IMPLEMENTATION IN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {billings.map((b) => (
            <BillingCardFactory 
              key={b.id} 
              data={b} 
              onViewHistory={() => setCurrentView('history')}
              onGeneratePDF={generatePDF}
            />
          ))}
          {billings.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium text-lg">Tidak ada tagihan yang ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTagihan;