import { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
  MessageCircle, RefreshCw, CheckCircle, XCircle,
  Clock, AlertTriangle, Eye, X, MessageSquare, 
  Layers
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Tagihan {
  id_tagihan: number;
  nama_lengkap: string;
  no_hp: string;
  nomor_kamar: string;
  total_tagihan: number;
  tanggal_jatuh_tempo: string;
  status_tagihan: 'belum_bayar' | 'lunas' | 'telat' | 'pending';
}

interface Pembayaran {
  id_pembayaran: number;
  id_tagihan: number;
  nama_lengkap: string;
  nomor_kamar: string;
  total_tagihan: number;
  tanggal_bayar: string;
  jumlah_bayar: number;
  metode_pembayaran: string;
  bukti_bayar: string;
  status_verifikasi: 'pending' | 'diterima' | 'ditolak';
  catatan_admin?: string;
}

const statusConfig = {
  lunas:       { label: 'Lunas',       bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle size={12}/> },
  pending:     { label: 'Menunggu',    bg: 'bg-amber-100',   text: 'text-amber-700',   icon: <Clock size={12}/> },
  belum_bayar: { label: 'Belum Bayar', bg: 'bg-red-100',     text: 'text-red-700',     icon: <AlertTriangle size={12}/> },
  telat:       { label: 'Telat',       bg: 'bg-rose-100',    text: 'text-rose-800',    icon: <XCircle size={12}/> },
};

const fmt = (n: number) => 'Rp ' + (n || 0).toLocaleString('id-ID');
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) : '-';

const AdminTagihan = () => {
  const [tagihans, setTagihans]       = useState<Tagihan[]>([]);
  const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState<'semua' | 'pending'>('semua');
  const [verifying, setVerifying]     = useState<number | null>(null);
  const [preview, setPreview]         = useState<Pembayaran | null>(null);
  const [catatan, setCatatan]         = useState('');

  const fetchTagihan = async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([
        api.get('/tagihan'),
        api.get('/pembayaran/pending'),
      ]);
      setTagihans(t.data.tagihans || []);
      setPembayarans(p.data.pembayarans || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTagihan(); }, []);

  const sendWhatsApp = (t: Tagihan) => {
    const pesan = `Halo ${t.nama_lengkap}, mengingatkan tagihan kost Kamar ${t.nomor_kamar} sebesar ${fmt(t.total_tagihan)} jatuh tempo pada ${fmtDate(t.tanggal_jatuh_tempo)}. Mohon segera dibayar. Terima kasih!`;
    const url = `https://wa.me/${t.no_hp.replace(/^0/, '62')}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
  };

  const verifikasi = async (id_pembayaran: number, status: 'diterima' | 'ditolak') => {
    setVerifying(id_pembayaran);
    try {
      await api.post(`/pembayaran/${id_pembayaran}/verifikasi`, { status_verifikasi: status, catatan_admin: catatan });
      setPreview(null);
      fetchTagihan();
    } catch { alert('Gagal memverifikasi'); } finally { setVerifying(null); }
  };

  const stats = {
    total: tagihans.length,
    lunas: tagihans.filter(t => t.status_tagihan === 'lunas').length,
    belum: tagihans.filter(t => t.status_tagihan === 'belum_bayar' || t.status_tagihan === 'telat').length,
    pending: pembayarans.length
  };

  return (
    <div className="p-2 space-y-6">
      {/* ── Kotak Ringkasan ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700 p-5 rounded-2xl text-white border border-slate-600">
          <p className="text-[40px] font-black leading-none">{stats.total}</p>
          <p className="text-xs font-bold uppercase opacity-60 mt-2 tracking-widest">Total Tagihan</p>
        </div>
        <div className="bg-emerald-600 p-5 rounded-2xl text-white border border-emerald-500">
          <p className="text-[40px] font-black leading-none">{stats.lunas}</p>
          <p className="text-xs font-bold uppercase opacity-60 mt-2 tracking-widest">Lunas</p>
        </div>
        <div className="bg-rose-600 p-5 rounded-2xl text-white border border-rose-500">
          <p className="text-[40px] font-black leading-none">{stats.belum}</p>
          <p className="text-xs font-bold uppercase opacity-60 mt-2 tracking-widest">Belum Bayar</p>
        </div>
        <div className="bg-amber-500 p-5 rounded-2xl text-white border border-amber-400">
          <p className="text-[40px] font-black leading-none">{stats.pending}</p>
          <p className="text-xs font-bold uppercase opacity-60 mt-2 tracking-widest">Menunggu</p>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Manajemen Tagihan</h2>
            <p className="text-xs text-slate-400">Status hunian dan validasi bukti bayar</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
              <button onClick={() => setActiveTab('semua')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'semua' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Semua Tagihan</button>
              <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Perlu Validasi</button>
            </div>
            <button onClick={fetchTagihan} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-white transition-all shadow-sm">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'semua' ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Penyewa / Kamar</th>
                  <th className="px-6 py-4">Total Tagihan</th>
                  <th className="px-6 py-4">Jatuh Tempo</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tagihans.map(t => (
                  <tr key={t.id_tagihan} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700 text-sm">{t.nama_lengkap}</div>
                      <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Kamar {t.nomor_kamar}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{fmt(t.total_tagihan)}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{fmtDate(t.tanggal_jatuh_tempo)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${statusConfig[t.status_tagihan]?.bg} ${statusConfig[t.status_tagihan]?.text}`}>
                        {statusConfig[t.status_tagihan]?.icon} {statusConfig[t.status_tagihan]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1.5">
                        <button className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 hover:text-blue-600 transition-all border border-transparent hover:border-slate-300" title="Detail">
                          <Eye size={16}/>
                        </button>
                        {t.status_tagihan !== 'lunas' && (
                          <button onClick={() => sendWhatsApp(t)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100" title="Kirim Notifikasi WA">
                            <MessageCircle size={16}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-amber-50/50 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Penyewa</th>
                  <th className="px-6 py-4">Jumlah Bayar</th>
                  <th className="px-6 py-4">Metode</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pembayarans.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400 italic text-sm">Tidak ada pembayaran yang menunggu validasi.</td></tr>
                ) : (
                  pembayarans.map(p => (
                    <tr key={p.id_pembayaran} className="hover:bg-amber-50/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 text-sm">{p.nama_lengkap}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600 text-sm">{fmt(p.jumlah_bayar)}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 capitalize">{p.metode_pembayaran}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => { setPreview(p); setCatatan(''); }} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black hover:bg-amber-200 transition-all shadow-sm border border-amber-200">PERIKSA</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal Verifikasi ── */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Verifikasi Pembayaran</h3>
              <button onClick={() => setPreview(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-5">
               <div className="flex justify-center bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200">
                  <img src={preview.bukti_bayar} alt="Bukti Transfer" className="max-h-64 rounded-lg shadow-md" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Penyewa</p>
                    <p className="font-bold text-slate-700 text-sm">{preview.nama_lengkap}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Nominal Transfer</p>
                    <p className="font-bold text-emerald-600 text-sm">{fmt(preview.jumlah_bayar)}</p>
                  </div>
               </div>
               <div className="space-y-2">
                 <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <MessageSquare size={12} /> Catatan Tambahan
                 </div>
                 <textarea className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Tulis catatan jika bukti tidak jelas..." rows={2} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
               </div>
               <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => verifikasi(preview.id_pembayaran, 'ditolak')} className="py-3 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition-all disabled:opacity-50">TOLAK</button>
                  <button onClick={() => verifikasi(preview.id_pembayaran, 'diterima')} className="py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 uppercase tracking-widest">{verifying ? 'Memproses...' : 'Terima'}</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTagihan;