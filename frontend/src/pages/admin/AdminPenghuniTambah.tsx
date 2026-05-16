import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import penghuniService from '../../services/penghuniService';
import type { Kamar } from '../../types/kamar';

const AdminPenghuniTambah = () => {
  const navigate = useNavigate();

  // --- State data kamar dari API ---
  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [isLoadingKamar, setIsLoadingKamar] = useState(true);

  // --- State form penghuni ---
  const [selectedKamar, setSelectedKamar] = useState<Kamar | null>(null);
  const [durasi, setDurasi] = useState(1);
  const [totalTagihan, setTotalTagihan] = useState(0);
  const [estimasiCheckOut, setEstimasiCheckOut] = useState('');
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alamat, setAlamat] = useState('');
  const [tglMasuk, setTglMasuk] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Ambil data kamar tersedia dari API saat halaman dimuat ---
  useEffect(() => {
    setIsLoadingKamar(true);
    penghuniService.getKamarTersedia()
      .then((data: Kamar[]) => setKamarList(data))
      .catch(() => alert('Gagal memuat data kamar. Pastikan server berjalan.'))
      .finally(() => setIsLoadingKamar(false));
  }, []);

  // --- Hitung total tagihan & estimasi checkout saat kamar/durasi/tglMasuk berubah ---
  useEffect(() => {
    if (selectedKamar) {
      setTotalTagihan(selectedKamar.harga_bulanan * durasi);
      const date = new Date(tglMasuk);
      date.setMonth(date.getMonth() + Number(durasi));
      setEstimasiCheckOut(
        date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      );
    } else {
      setTotalTagihan(0);
      setEstimasiCheckOut('-');
    }
  }, [selectedKamar, durasi, tglMasuk]);

  // --- Submit ke API ---
  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !selectedKamar || !email || !password) {
      alert('Mohon lengkapi data yang wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      await penghuniService.create({
        nama_lengkap: nama,
        no_hp: hp,
        email,
        password,
        alamat_asal: alamat,
        id_kamar: selectedKamar.id_kamar,
        tanggal_masuk: tglMasuk,
        durasi_sewa_bulan: durasi,
        harga_deal: totalTagihan,
      });
      alert(`Berhasil menambahkan penghuni: ${nama}`);
      navigate('/admin/penghuni');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menyimpan data penghuni.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-light p-6">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <span className="cursor-pointer hover:text-primary transition" onClick={() => navigate('/admin/penghuni')}>Data Penghuni</span>
        <span>›</span>
        <span className="text-dark font-semibold">Tambah Penghuni Baru</span>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Tambah Penghuni Baru</h1>
          <p className="text-sm text-gray-400 mt-1">Membuat akun penyewa sekaligus mencatat sewa kamar</p>
        </div>
        <button onClick={() => navigate('/admin/penghuni')} className="border border-gray-200 bg-white text-gray-500 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition">
          ← Kembali
        </button>
      </div>

      <form className="bg-white rounded-2xl border border-gray-100 overflow-hidden" onSubmit={handleSimpan}>
        <div className="p-8 space-y-8">

          {/* Data Penghuni */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Data Penghuni</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Nama Lengkap <span className="text-red-500">*</span></label>
                <input className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="Masukkan nama lengkap" value={nama} onChange={(e) => setNama(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">No. HP <span className="text-red-500">*</span></label>
                <input className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="08..." value={hp} onChange={(e) => setHp(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Email <span className="text-red-500">*</span></label>
                <input type="email" className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Password <span className="text-red-500">*</span></label>
                <input type="password" className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Alamat Asal</label>
                <input className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="Masukkan alamat lengkap" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Data Sewa — Pilih Kamar dari API */}
          <div className="pt-8 border-t border-gray-50">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Data Sewa</h3>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-600 mb-3 block">
                Pilih Kamar Tersedia <span className="text-red-500">*</span>
              </label>

              {isLoadingKamar ? (
                <div className="py-4 text-sm text-gray-400 italic">Memuat daftar kamar...</div>
              ) : kamarList.length === 0 ? (
                <div className="py-4 text-sm text-red-400 italic">Tidak ada kamar tersedia saat ini.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {kamarList.map((kamar) => {
                    const fasilitasList: string[] = (() => {
                      try { return JSON.parse(kamar.fasilitas); } catch { return [kamar.fasilitas]; }
                    })();
                    const isSelected = selectedKamar?.id_kamar === kamar.id_kamar;
                    return (
                      <div
                        key={kamar.id_kamar}
                        onClick={() => setSelectedKamar(isSelected ? null : kamar)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-secondary' : 'border-gray-100 hover:border-blue-200'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-dark">Kamar {kamar.nomor_kamar}</p>
                          <span className="text-[8px] px-2 py-0.5 rounded-full font-bold uppercase bg-green-50 text-green-600">
                            Tersedia
                          </span>
                        </div>
                        <p className="text-primary font-bold">
                          Rp {kamar.harga_bulanan.toLocaleString('id-ID')}
                          <span className="text-[10px] font-normal text-gray-400"> / bln</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">{kamar.luas_kamar} m²</p>
                        {fasilitasList.length > 0 && (
                          <p className="text-[10px] text-gray-400 mt-1 truncate">{fasilitasList.join(', ')}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Tanggal Masuk <span className="text-red-500">*</span></label>
                <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" value={tglMasuk} onChange={(e) => setTglMasuk(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Durasi (Bulan) <span className="text-red-500">*</span></label>
                <input type="number" min="1" value={durasi} onChange={(e) => setDurasi(Number(e.target.value))} className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Tagihan Awal</p>
                <p className="text-xl font-bold text-primary">Rp {totalTagihan.toLocaleString('id-ID')}</p>
                {selectedKamar && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Rp {selectedKamar.harga_bulanan.toLocaleString('id-ID')} × {durasi} bulan
                  </p>
                )}
              </div>

              <div className="p-4 bg-secondary rounded-xl border border-blue-100 flex justify-between items-center">
                <p className="text-xs font-bold text-gray-600">Estimasi Check-Out:</p>
                <p className="text-sm font-bold text-dark">{estimasiCheckOut || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/admin/penghuni')} className="px-8 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
            Batal
          </button>
          <button type="submit" disabled={isSubmitting || !selectedKamar} className="px-10 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all">
            {isSubmitting ? 'Menyimpan...' : 'Simpan Penghuni'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPenghuniTambah;