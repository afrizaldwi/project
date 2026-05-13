import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminTambahPenghuni = () => {
  const navigate = useNavigate();
  const [tipeKamar, setTipeKamar] = useState('');
  const [selectedKamar, setSelectedKamar] = useState('');
  const [durasi, setDurasi] = useState(1);
  const [totalTagihan, setTotalTagihan] = useState(0);
  const [estimasiCheckOut, setEstimasiCheckOut] = useState('');
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [email, setEmail] = useState('');
  const [tglMasuk, setTglMasuk] = useState(new Date().toISOString().split('T')[0]);

  const roomPrices: Record<string, number> = {
    'A': 800000,
    'B': 1000000,
    'C': 1500000
  };

  useEffect(() => {
    if (tipeKamar) {
      setTotalTagihan(roomPrices[tipeKamar] * durasi);
      
      const date = new Date();
      date.setMonth(date.getMonth() + Number(durasi));
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      setEstimasiCheckOut(date.toLocaleDateString('id-ID', options));
    } else {
      setTotalTagihan(0);
      setEstimasiCheckOut('-');
    }
  }, [tipeKamar, durasi]);

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nama || !tipeKamar || !selectedKamar) {
      alert("Mohon lengkapi data yang wajib diisi!");
      return;
    }

    const newResident = {
      id: Date.now(),
      nama: nama,
      kamar: selectedKamar,
      status: "Aktif",
      tglMasuk: tglMasuk,
      tglKeluar: "-"
    };

    // Get existing residents from localStorage
    const savedResidents = localStorage.getItem('residents');
    const residentsList = savedResidents ? JSON.parse(savedResidents) : [
      { id: 1, nama: "Budi Santoso", kamar: "A1", status: "Aktif", tglMasuk: "2024-05-01", tglKeluar: "-" },
      { id: 2, nama: "Siti Aminah", kamar: "B3", status: "Aktif", tglMasuk: "2024-05-10", tglKeluar: "-" },
      { id: 3, nama: "Agus Pratama", kamar: "C2", status: "Aktif", tglMasuk: "2024-04-15", tglKeluar: "-" },
    ];

    // Add new resident
    const updatedResidents = [...residentsList, newResident];
    
    // Save back to localStorage
    localStorage.setItem('residents', JSON.stringify(updatedResidents));

    alert(`Berhasil menambahkan penghuni: ${nama}`);
    navigate('/admin/penghuni');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tambah Penghuni Baru</h2>
          <p className="text-sm text-gray-400">Membuat akun penyewa sekaligus mencatat sewa kamar.</p>
        </div>

        <form className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* DATA PENGHUNI Section */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Data Penghuni</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input 
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" 
                    placeholder="Masukkan nama lengkap" 
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">No. HP <span className="text-red-500">*</span></label>
                  <input 
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" 
                    placeholder="08..." 
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" 
                    placeholder="email@contoh.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Password <span className="text-red-500">*</span></label>
                  <input type="password" title="Password minimal 8 karakter" className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="••••••••" required />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Alamat Asal</label>
                  <input className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="Masukkan alamat lengkap" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Foto Profil</label>
                  <div className="flex items-center gap-4">
                    <input type="file" className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                </div>
              </div>
            </div>

            {/* DATA SEWA Section */}
            <div className="pt-8 border-t border-gray-50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Data Sewa</h3>
              
              {/* Tipe Kamar (Image 4) */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-600 mb-3 block">Pilih Tipe Kamar</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'A', name: 'Tipe A', price: '800.000', desc: 'Fasilitas Dasar' },
                    { id: 'B', name: 'Tipe B', price: '1.000.000', desc: 'AC + Kamar Mandi Dalam' },
                    { id: 'C', name: 'Tipe C', price: '1.500.000', desc: 'VIP + Kulkas' },
                  ].map((t) => (
                    <div 
                      key={t.id}
                      onClick={() => { setTipeKamar(t.id); setSelectedKamar(''); }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        tipeKamar === t.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-50 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-gray-800">{t.name}</p>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${t.id === 'C' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                          {t.id === 'C' ? 'Terisi' : 'Tersedia'}
                        </span>
                      </div>
                      <p className="text-blue-600 font-black">Rp {t.price} <span className="text-[10px] font-normal text-gray-400">/ bln</span></p>
                      <p className="text-[10px] text-gray-400 mt-2">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nomor Kamar Selection (5 rooms each) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Pilih Kamar <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-5 gap-2">
                    {tipeKamar ? (
                      [1, 2, 3, 4, 5].map(n => (
                        <button 
                          key={n}
                          type="button"
                          onClick={() => setSelectedKamar(`${tipeKamar}${n}`)}
                          className={`p-2 rounded-lg border-2 text-xs font-bold transition-all ${
                            selectedKamar === `${tipeKamar}${n}` 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'border-gray-50 text-gray-400 hover:border-blue-100'
                          }`}
                        >
                          {tipeKamar}{n}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-5 py-2 text-xs text-gray-300 italic">Pilih tipe kamar terlebih dahulu</div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Tanggal Masuk <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" 
                    value={tglMasuk}
                    onChange={(e) => setTglMasuk(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Durasi (Bulan) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    min="1"
                    value={durasi}
                    onChange={(e) => setDurasi(Number(e.target.value))}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20" 
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Tagihan Awal</p>
                  <p className="text-xl font-black text-blue-600">Rp {totalTagihan.toLocaleString('id-ID')}</p>
                </div>

                <div className="md:col-span-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex justify-between items-center">
                  <p className="text-xs font-bold text-gray-600 italic">Estimasi Check-Out:</p>
                  <p className="text-sm font-black text-gray-800">{estimasiCheckOut}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/admin/penghuni')}
              className="px-8 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              onClick={handleSimpan}
              className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
              Simpan Penghuni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTambahPenghuni;
