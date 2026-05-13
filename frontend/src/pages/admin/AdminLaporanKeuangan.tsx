import { useState, type FC, type FormEvent } from 'react';
import { useFinancialReport } from '../../hook/useFinancialReport';
import { Download, Plus, Wallet, TrendingUp, TrendingDown, Calendar, FileText, DollarSign } from 'lucide-react';

const AdminLaporanKeuangan: FC = () => {
  const { transactions, summary, addExpense, exportToCSV } = useFinancialReport();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ date: '', description: '', amount: '' });

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    if (!expenseForm.date || !expenseForm.description || !expenseForm.amount) return;
    
    addExpense({
      date: expenseForm.date,
      description: expenseForm.description,
      amount: Number(expenseForm.amount)
    });
    
    // Reset form
    setExpenseForm({ date: '', description: '', amount: '' });
    setIsAddingExpense(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Laporan Keuangan</h1>
          <p className="text-slate-500 mt-1">Ringkasan transaksi dan pencatatan pengeluaran operasional.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsAddingExpense(!isAddingExpense)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-indigo-200 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Catat Pengeluaran
          </button>
          <button 
            onClick={exportToCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-slate-100 hover:-translate-y-0.5"
          >
            <Download size={18} />
            Cetak CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={80} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
              <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp size={16} /></span>
              Total Pemasukan
            </p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{formatRupiah(summary.totalIncome)}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingDown size={80} className="text-rose-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
              <span className="p-2 bg-rose-50 rounded-lg text-rose-600"><TrendingDown size={16} /></span>
              Total Pengeluaran
            </p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{formatRupiah(summary.totalExpense)}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 border border-indigo-500 shadow-[0_8px_30px_rgb(79,70,229,0.2)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <Wallet size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-indigo-100 flex items-center gap-2 mb-2">
              <span className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white"><Wallet size={16} /></span>
              Saldo Bersih
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">{formatRupiah(summary.netBalance)}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Pengeluaran (Visible if isAddingExpense) */}
        {isAddingExpense && (
          <div className="lg:col-span-1 animate-in slide-in-from-left-4 duration-300">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="border-b border-slate-100 p-5 bg-slate-50/50">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Plus size={18} className="text-indigo-600" />
                  Catatan Pengeluaran Baru
                </h2>
              </div>
              <form onSubmit={handleAddExpense} className="p-5 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tanggal</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="date" 
                      required
                      value={expenseForm.date}
                      onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Keterangan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Beli token listrik"
                      value={expenseForm.description}
                      onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Jumlah (Rp)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="0"
                      value={expenseForm.amount}
                      onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddingExpense(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Data Laporan Keuangan (Table) */}
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 ${isAddingExpense ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="border-b border-slate-100 p-5 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              Data Laporan Keuangan
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Keterangan</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipe</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText size={48} className="text-slate-200 mb-4" />
                        <p>Belum ada data transaksi</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-800">
                        {t.description}
                      </td>
                      <td className="py-4 px-6 text-sm whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-sm font-semibold text-right whitespace-nowrap ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {t.type === 'income' ? '+' : '-'} {formatRupiah(t.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminLaporanKeuangan;