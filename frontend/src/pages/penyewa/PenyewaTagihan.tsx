import { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import {
  Upload, CheckCircle, Clock, AlertTriangle,
  XCircle, CreditCard, Wallet, Building2, X,
  FileText, RefreshCw, Download
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Tagihan {
  id_tagihan: number;
  kode_invoice: string;
  nomor_kamar: string;
  tanggal_tagihan: string;
  tanggal_jatuh_tempo: string;
  total_tagihan: number;
  status_tagihan: 'belum_bayar' | 'lunas' | 'telat' | 'pending';
  hari_tersisa: number;
  id_pembayaran?: number;
  tanggal_bayar?: string;
  jumlah_bayar?: number;
  metode_pembayaran?: string;
  bukti_bayar?: string;
  status_verifikasi?: 'pending' | 'diterima' | 'ditolak';
  catatan_admin?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Tagihan['status_tagihan'] }) => {
  const map = {
    lunas:       { label: 'Lunas',       cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12}/> },
    pending:     { label: 'Menunggu', cls: 'bg-amber-100 text-amber-700', icon: <Clock size={12}/> },
    belum_bayar: { label: 'Belum Bayar', cls: 'bg-red-100 text-red-700',     icon: <AlertTriangle size={12}/> },
    telat:       { label: 'Telat',       cls: 'bg-rose-100 text-rose-800',    icon: <XCircle size={12}/> },
  };
  const s = map[status] ?? map.belum_bayar;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PenyewaTagihan = () => {
  const [tagihans, setTagihans]     = useState<Tagihan[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<Tagihan | null>(null);
  const [showBayar, setShowBayar]   = useState(false);
  const [metode, setMetode]         = useState('');
  const [file, setFile]             = useState<File | null>(null);
  const [preview, setPreview]       = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [success, setSuccess]       = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tagihan/saya');
      setTagihans(res.data.tagihans || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleBayar = async () => {
    if (!selected || !metode || !file) return alert('Lengkapi semua data!');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('metode_pembayaran', metode);
      form.append('bukti_bayar', file);
      await api.post(`/tagihan/${selected.id_tagihan}/bayar`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      await fetchData();
      setTimeout(() => {
        setShowBayar(false);
        setSuccess(false);
        setFile(null);
        setPreview(null);
        setMetode('');
        setSelected(null);
      }, 2500);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal mengirim pembayaran');
    } finally {
      setUploading(false);
    }
  };

  const openBayar = (t: Tagihan) => {
    setSelected(t);
    setShowBayar(true);
    setSuccess(false);
    setFile(null);
    setPreview(null);
    setMetode('');
  };

  const aktif    = tagihans.filter(t => t.status_tagihan !== 'lunas');
  const riwayat  = tagihans.filter(t => t.status_tagihan === 'lunas');

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Tagihan Saya</h2>
          <p className="text-sm text-slate-400">Lihat & bayar tagihan kost kamu</p>
        </div>
        <button onClick={fetchData} className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:shadow-sm transition-all active:scale-95">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-300 animate-pulse text-sm">Memuat data tagihan...</div>
      ) : (
        <div className="space-y-10">
          {/* Section: Tagihan Aktif */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Tagihan Aktif</h3>
            {aktif.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aktif.map(t => (
                  <TagihanCard key={t.id_tagihan} t={t} onBayar={() => openBayar(t)} />
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center">
                <CheckCircle size={40} className="mx-auto mb-3 text-emerald-400" />
                <p className="text-emerald-800 font-bold">Semua tagihan sudah beres!</p>
                <p className="text-emerald-600/70 text-xs mt-1">Terima kasih telah membayar tepat waktu.</p>
              </div>
            )}
          </section>

          {/* Section: Riwayat */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Riwayat Pembayaran</h3>
            {riwayat.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      {riwayat.map((t) => (
                        <tr key={t.id_tagihan} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="hidden sm:flex w-10 h-10 rounded-full bg-emerald-50 items-center justify-center text-emerald-500">
                                <FileText size={18} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-700">{fmtDate(t.tanggal_jatuh_tempo)}</div>
                                <div className="text-[10px] font-mono text-slate-400 uppercase">{t.kode_invoice}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right sm:text-left">
                            <div className="text-sm font-black text-slate-800">{fmt(t.total_tagihan)}</div>
                            <StatusBadge status="lunas" />
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              disabled 
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-[11px] font-bold cursor-not-allowed"
                              title="Fitur download invoice segera hadir"
                            >
                              <Download size={14} />
                              <span className="hidden sm:inline">Invoice</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-slate-400 text-sm italic">Belum ada riwayat pembayaran.</p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modal Pembayaran (Logic Tetap Sama) */}
      {showBayar && selected && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-end sm:items-center justify-center p-4" onClick={() => setShowBayar(false)}>
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* ... isi modal sama seperti sebelumnya ... */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Konfirmasi Bayar</h3>
                <button onClick={() => setShowBayar(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6 text-center">
                <div className="bg-blue-50 text-blue-700 py-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-70">Total Tagihan</p>
                    <p className="text-2xl font-black">{fmt(selected.total_tagihan)}</p>
                </div>
                {/* Simulasi form input metode dan file seperti sebelumnya */}
                <div className="space-y-4 text-left">
                    <select value={metode} onChange={(e)=>setMetode(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="">Pilih Metode Pembayaran</option>
                        <option value="transfer">Transfer Bank</option>
                        <option value="ewallet">E-Wallet (Dana/OVO)</option>
                    </select>
                    <input type="file" onChange={handleFileChange} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                </div>
                <button 
                  onClick={handleBayar}
                  disabled={uploading || !metode || !file}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-30 disabled:shadow-none"
                >
                    {uploading ? 'Proses...' : 'Kirim Bukti Bayar'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TagihanCard ─────────────────────────────────────────────────────────────
const TagihanCard = ({ t, onBayar }: { t: Tagihan; onBayar: () => void }) => {
  return (
    <div className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{t.kode_invoice}</p>
          <StatusBadge status={t.status_tagihan} />
        </div>
        <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
           <CreditCard size={18} />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Total Tagihan</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{fmt(t.total_tagihan)}</p>
        </div>
        
        {t.status_tagihan !== 'pending' && (
          <button 
            onClick={onBayar} 
            className="w-full py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-100 group-hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            Bayar Sekarang
          </button>
        )}
      </div>
    </div>
  );
};

export default PenyewaTagihan;