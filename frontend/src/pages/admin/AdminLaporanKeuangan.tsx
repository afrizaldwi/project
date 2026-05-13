import React, { useState } from 'react';

const AdminLaporanKeuangan = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenses, setExpenses] = useState<any[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, tanggal: "3 Mei 2026", keterangan: "Tagihan Listrik Bulan Mei", tipe: "Pengeluaran", jumlah: 450000 },
      { id: 2, tanggal: "5 Mei 2026", keterangan: "Perbaikan Keran Air Kamar 03", tipe: "Pengeluaran", jumlah: 75000 },
    ];
  });

  const [residents, setResidents] = useState<any[]>(() => {
    const saved = localStorage.getItem('finance_residents');
    return saved ? JSON.parse(saved) : [
      { nama: "Budi Santoso", harga: 1500000, tgl: "1 Mei 2026", kamar: "01" },
      { nama: "Siti Aminah", harga: 1500000, tgl: "2 Mei 2026", kamar: "02" },
    ];
  });

  // Persist to localStorage
  React.useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  React.useEffect(() => {
    localStorage.setItem('finance_residents', JSON.stringify(residents));
  }, [residents]);

  const [formData, setFormData] = useState({ tanggal: '', keterangan: '', jumlah: '' });


  const totalPemasukan = residents.reduce((acc, curr) => acc + curr.harga, 0);
  const totalPengeluaran = expenses.reduce((acc, curr) => acc + Number(curr.jumlah), 0);
  const saldoBersih = totalPemasukan - totalPengeluaran;

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      tanggal: new Date(formData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      keterangan: formData.keterangan,
      tipe: "Pengeluaran",
      jumlah: Number(formData.jumlah)
    };
    setExpenses([newEntry, ...expenses]);
    setFormData({ tanggal: '', keterangan: '', jumlah: '' });
    setShowExpenseForm(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Laporan Keuangan</h2>
          <p className="text-sm text-gray-400">Ringkasan transaksi dan pencatatan pengeluaran operasional.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <span className="text-lg">+</span> Catat Pengeluaran
          </button>
          <button className="bg-white text-gray-600 border border-gray-200 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12 a2 2 0 002-2v-1M16 9l-4-4-4 4M12 5v13" /></svg>
            Cetak CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-green-50 rounded-lg">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </span>
              <p className="text-xs font-bold text-gray-400">Total Pemasukan</p>
            </div>
            <p className="text-2xl font-black text-gray-800">Rp {totalPemasukan.toLocaleString('id-ID')}</p>
          </div>
          <svg className="w-12 h-12 text-green-50 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-red-50 rounded-lg">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
              </span>
              <p className="text-xs font-bold text-gray-400">Total Pengeluaran</p>
            </div>
            <p className="text-2xl font-black text-gray-800">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
          </div>
          <svg className="w-12 h-12 text-red-50 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-blue-200 flex items-center justify-between text-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-white/20 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </span>
              <p className="text-xs font-bold text-white/70">Saldo Bersih</p>
            </div>
            <p className="text-2xl font-black">Rp {saldoBersih.toLocaleString('id-ID')}</p>
          </div>
          <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Catatan Pengeluaran Baru (Image 3) */}
        {showExpenseForm && (
          <div className="w-full lg:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-in slide-in-from-left duration-300">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-6">
              <span className="text-blue-600 text-lg">+</span> Catatan Pengeluaran Baru
            </h3>
            <form onSubmit={handleSimpan} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Tanggal</label>
                <input 
                  type="date"
                  className="w-full border border-gray-100 bg-gray-50/50 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Keterangan</label>
                <textarea 
                  className="w-full border border-gray-100 bg-gray-50/50 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20 resize-none h-24"
                  placeholder="Contoh: Beli token listrik"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Jumlah (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input 
                    type="number"
                    className="w-full border border-gray-100 bg-gray-50/50 pl-8 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20"
                    placeholder="0"
                    value={formData.jumlah}
                    onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowExpenseForm(false)}
                  className="flex-1 py-3 bg-gray-50 text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Laporan Keuangan (Image 2 Table) */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <h3 className="font-bold text-gray-800">Data Laporan Keuangan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanggal</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keterangan</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Tipe</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Fixed Data from Residents (Pemasukan) */}
                {residents.map((r, i) => (
                  <tr key={`p-${i}`} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 text-xs text-gray-500">{r.tgl}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-800">Pembayaran Sewa Kost Kamar {r.kamar}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Pemasukan</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-500 text-sm">
                      + Rp {r.harga.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                
                {/* Dynamic Data (Pengeluaran) */}
                {expenses.map((ex) => (
                  <tr key={ex.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 text-xs text-gray-500">{ex.tanggal}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-800">{ex.keterangan}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-red-50 text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">Pengeluaran</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-red-400 text-sm">
                      - Rp {ex.jumlah.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLaporanKeuangan;
