import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  MessageCircle,
  Download
} from 'lucide-react';
import type { Billing } from '../../types/invoice';

// Interface for Products (Billing Cards)
interface BillingCardProps {
  data: Billing;
  onViewHistory: () => void;
  onGeneratePDF?: (data: any) => void;
}

// Product 1: Paid Card
const PaidCard: React.FC<BillingCardProps> = ({ data, onViewHistory, onGeneratePDF }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
        <CheckCircle2 size={12}/> LUNAS
      </span>
      <div className="flex gap-2">
        <button onClick={onViewHistory} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all">
          <Eye size={16} />
        </button>
        {onGeneratePDF && (
          <button onClick={() => onGeneratePDF(data)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-all">
            <Download size={16} />
          </button>
        )}
      </div>
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-lg">{data.penyewa}</h4>
      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">{data.kamar}</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Tagihan</p>
          <p className="text-xl font-black text-slate-800">Rp {data.totalTagihan.toLocaleString('id-ID')}</p>
        </div>
        <p className="text-[10px] font-medium text-slate-400">Jatuh Tempo: {data.jatuhTempo}</p>
      </div>
    </div>
  </div>
);

// Product 2: Unpaid Card
const UnpaidCard: React.FC<BillingCardProps> = ({ data, onViewHistory }) => (
  <div className="bg-white rounded-2xl p-6 border-2 border-rose-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-2">
       <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
    </div>
    <div className="flex justify-between items-start mb-4">
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wider">
        <AlertCircle size={12}/> BELUM BAYAR
      </span>
      <div className="flex gap-2">
        <button onClick={onViewHistory} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all">
          <Eye size={16} />
        </button>
        <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all shadow-sm">
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-lg">{data.penyewa}</h4>
      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-3">{data.kamar}</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-rose-400 text-[10px] font-bold uppercase tracking-wider">Tagihan Tertunda</p>
          <p className="text-xl font-black text-slate-800">Rp {data.totalTagihan.toLocaleString('id-ID')}</p>
        </div>
        <p className="text-[10px] font-bold text-rose-600">Terlambat</p>
      </div>
    </div>
  </div>
);

// Product 3: Pending Card
const PendingCard: React.FC<BillingCardProps> = ({ data, onViewHistory }) => (
  <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
        <Clock size={12}/> MENUNGGU VALIDASI
      </span>
      <button onClick={onViewHistory} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all">
        <Eye size={16} />
      </button>
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-lg">{data.penyewa}</h4>
      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">{data.kamar}</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Jumlah Dibayar</p>
          <p className="text-xl font-black text-slate-800">Rp {data.totalTagihan.toLocaleString('id-ID')}</p>
        </div>
        <button className="text-[10px] font-bold text-indigo-600 hover:underline">Verifikasi Sekarang</button>
      </div>
    </div>
  </div>
);

// THE FACTORY
export const BillingCardFactory: React.FC<BillingCardProps> = (props) => {
  const { data } = props;
  
  switch (data.status.toUpperCase()) {
    case 'LUNAS':
    case 'DITERIMA':
      return <PaidCard {...props} />;
    case 'BELUM BAYAR':
      return <UnpaidCard {...props} />;
    case 'MENUNGGU':
    case 'PENDING':
      return <PendingCard {...props} />;
    default:
      return (
        <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-500 italic">
          Status tagihan tidak dikenali: {data.status}
        </div>
      );
  }
};