import { useState, useCallback, useMemo } from 'react';
import type { Billing, TransactionHistory, BillingSummary } from '../types/invoice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock Data
const initialBillings: Billing[] = [
  { id: '1', penyewa: 'Budi Santoso', kamar: 'KAMAR A-01', totalTagihan: 1500000, jatuhTempo: '11 Mar 2026', status: 'LUNAS' },
  { id: '2', penyewa: 'Budi Santoso', kamar: 'KAMAR A-01', totalTagihan: 1500000, jatuhTempo: '11 Apr 2026', status: 'LUNAS' },
  { id: '3', penyewa: 'Budi Santoso', kamar: 'KAMAR A-01', totalTagihan: 1500000, jatuhTempo: '11 Mei 2026', status: 'BELUM BAYAR' },
];

const initialHistory: TransactionHistory[] = [
  { id: '1', invoiceNumber: 'INV-001', penyewa: 'Budi Santoso', jumlah: 1500000, status: 'diterima', tanggal: '2026-03-11' },
  { id: '2', invoiceNumber: 'INV-002', penyewa: 'Siti Aminah', jumlah: 1200000, status: 'pending', tanggal: '2026-03-12' },
  { id: '3', invoiceNumber: 'INV-003', penyewa: 'Andi Wijaya', jumlah: 1500000, status: 'diterima', tanggal: '2026-03-13' },
  { id: '4', invoiceNumber: 'INV-004', penyewa: 'Rina Kusuma', jumlah: 900000, status: 'belum bayar', tanggal: '2026-03-14' },
];

export const useInvoices = () => {
  const [billings] = useState<Billing[]>(initialBillings);
  const [history] = useState<TransactionHistory[]>(initialHistory);
  const [filter, setFilter] = useState<'semua' | 'validasi'>('semua');

  const summary: BillingSummary = useMemo(() => ({
    total: billings.length,
    lunas: billings.filter(b => b.status === 'LUNAS').length,
    belumBayar: billings.filter(b => b.status === 'BELUM BAYAR').length,
    menunggu: billings.filter(b => b.status === 'MENUNGGU').length,
  }), [billings]);

  const filteredBillings = useMemo(() => {
    if (filter === 'validasi') return billings.filter(b => b.status === 'MENUNGGU');
    return billings;
  }, [billings, filter]);

  const generatePDF = useCallback((transaction: TransactionHistory) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('KOST BAHAGIA', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Jl. Raya Pendidikan No. 123, Jakarta', 105, 26, { align: 'center' });
    doc.line(20, 32, 190, 32);

    // Invoice Info
    doc.setFontSize(14);
    doc.text('INVOICE PEMBAYARAN', 20, 45);
    doc.setFontSize(10);
    doc.text(`Nomor Invoice : ${transaction.invoiceNumber}`, 20, 52);
    doc.text(`Tanggal        : ${transaction.tanggal}`, 20, 57);
    doc.text(`Nama Penyewa   : ${transaction.penyewa}`, 20, 62);
    doc.text(`Status         : ${transaction.status.toUpperCase()}`, 20, 67);

    // Table
    autoTable(doc, {
      startY: 80,
      head: [['Keterangan', 'Jumlah']],
      body: [
        ['Sewa Kost Bulanan', `Rp ${transaction.jumlah.toLocaleString('id-ID')}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(12);
    doc.text(`Total Bayar: Rp ${transaction.jumlah.toLocaleString('id-ID')}`, 190, finalY + 15, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.text('Terima kasih atas pembayaran Anda!', 105, 280, { align: 'center' });

    doc.save(`Invoice_${transaction.invoiceNumber}.pdf`);
  }, []);

  return {
    billings: filteredBillings,
    history,
    summary,
    filter,
    setFilter,
    generatePDF
  };
};