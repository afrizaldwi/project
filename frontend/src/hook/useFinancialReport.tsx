import { useState, useMemo, useCallback } from 'react';
import type { Transaction, ExpenseData, FinancialSummary } from '../types/finance';

// Mock data awal
const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-05-01', type: 'income', description: 'Pembayaran Sewa Kost Kamar 01', amount: 1500000 },
  { id: '2', date: '2026-05-02', type: 'income', description: 'Pembayaran Sewa Kost Kamar 02', amount: 1500000 },
  { id: '3', date: '2026-05-03', type: 'expense', description: 'Tagihan Listrik Bulan Mei', amount: 450000 },
  { id: '4', date: '2026-05-05', type: 'expense', description: 'Perbaikan Keran Air Kamar 03', amount: 75000 },
];

export const useFinancialReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Menghitung ringkasan
  const summary: FinancialSummary = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.totalIncome += curr.amount;
          acc.netBalance += curr.amount;
        } else {
          acc.totalExpense += curr.amount;
          acc.netBalance -= curr.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, netBalance: 0 }
    );
  }, [transactions]);

  // Fungsi tambah pengeluaran
  const addExpense = useCallback((data: ExpenseData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'expense',
      date: data.date,
      description: data.description,
      amount: data.amount,
    };
    
    // Tambah ke state, urutkan berdasarkan tanggal terbaru
    setTransactions((prev) => {
      const updated = [newTransaction, ...prev];
      return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);

  // Fungsi export CSV
  const exportToCSV = useCallback(() => {
    // Header CSV
    const headers = ['Tanggal', 'Tipe', 'Keterangan', 'Jumlah'];
    
    // Baris data
    const csvRows = transactions.map(t => {
      return `"${t.date}","${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}","${t.description}","${t.amount}"`;
    });

    // Gabungkan
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    // Buat blob dan unduh
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [transactions]);

  return {
    transactions,
    summary,
    addExpense,
    exportToCSV,
  };
};