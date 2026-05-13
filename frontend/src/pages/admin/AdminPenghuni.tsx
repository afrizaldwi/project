import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPenghuni = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('aktif');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPenghuni, setSelectedPenghuni] = useState<any>(null);

  // Initial Data with LocalStorage persistence
  const [residents, setResidents] = useState(() => {
    const saved = localStorage.getItem('residents');
    return saved ? JSON.parse(saved) : [
      { id: 1, nama: "Budi Santoso", kamar: "A1", status: "Aktif", tglMasuk: "2024-05-01", tglKeluar: "-" },
      { id: 2, nama: "Siti Aminah", kamar: "B3", status: "Aktif", tglMasuk: "2024-05-10", tglKeluar: "-" },
      { id: 3, nama: "Agus Pratama", kamar: "C2", status: "Aktif", tglMasuk: "2024-04-15", tglKeluar: "-" },
    ];
  });

  const [alumni, setAlumni] = useState(() => {
    const saved = localStorage.getItem('alumni');
    return saved ? JSON.parse(saved) : [
      { id: 4, nama: "Joko Susilo", kamar: "A2", status: "Non Aktif", tglMasuk: "2023-01-01", tglKeluar: "2024-01-01" },
    ];
  });

  // Persist to localStorage
  React.useEffect(() => {
    localStorage.setItem('residents', JSON.stringify(residents));
  }, [residents]);

  React.useEffect(() => {
    localStorage.setItem('alumni', JSON.stringify(alumni));
  }, [alumni]);


  const handleStatusChange = (id: number, newStatus: string) => {
    // Update logic: Move item between lists if status changes
    if (newStatus === 'Non Aktif' && activeTab === 'aktif') {
      const itemToMove = residents.find(r => r.id === id);
      if (itemToMove) {
        setResidents(residents.filter(r => r.id !== id));
        setAlumni([...alumni, { ...itemToMove, status: 'Non Aktif', tglKeluar: new Date().toLocaleDateString() }]);
      }
    } else if (newStatus === 'Aktif' && activeTab === 'riwayat') {
      const itemToMove = alumni.find(r => r.id === id);
      if (itemToMove) {
        setAlumni(alumni.filter(r => r.id !== id));
        setResidents([...residents, { ...itemToMove, status: 'Aktif', tglKeluar: '-' }]);
      }
    }
  };

  const handleSavePerpanjang = () => {
    if (selectedPenghuni) {
      // In a real app, this would be an API call.
      // Here we just simulate success and maybe update something if needed.
      // For now, let's just show a success alert and close modal.
      alert(`Berhasil memperpanjang sewa untuk ${selectedPenghuni.nama}`);
      setIsModalOpen(false);
      setSelectedPenghuni(null);
    }
  };

  const currentData = (activeTab === 'aktif' ? residents : alumni).filter(item => 
    item.nama.toLowerCase().includes(search.toLowerCase()) || 
    item.kamar.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Data Penghuni</h2>
        <button 
          onClick={() => navigate('/admin/penghuni/tambah')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
        >
          + Tambah Penghuni
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-6">Kelola data penghuni Kost Bahagia</p>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('aktif')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'aktif' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Penghuni Aktif
          </button>
          <button 
            onClick={() => setActiveTab('riwayat')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'riwayat' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Riwayat / Alumni
          </button>
        </div>
        <div className="relative flex-1 max-w-sm">
          <input 
            type="text"
            placeholder="Cari nama penghuni..."
            className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Nama</th>
              <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Kamar</th>
              <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Tgl Masuk</th>
              <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Tgl Keluar</th>
              <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Pilih Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{item.nama}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{item.kamar}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">{item.tglMasuk}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">{item.tglKeluar}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer outline-none border-none transition-all ${
                        item.status === 'Aktif' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non Aktif">Non Aktif</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'Aktif' ? (
                      <button 
                        onClick={() => { setSelectedPenghuni(item); setIsModalOpen(true); }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs underline underline-offset-4"
                      >
                        Perpanjang
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-20 text-center text-gray-400 italic text-sm">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Perpanjang */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Perpanjang Sewa</h3>
            <p className="text-gray-500 mb-6 text-sm">Konfirmasi perpanjangan sewa untuk penghuni <span className="text-blue-600 font-bold">{selectedPenghuni?.nama}</span></p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-gray-600 font-bold text-sm">Batal</button>
              <button onClick={handleSavePerpanjang} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPenghuni;