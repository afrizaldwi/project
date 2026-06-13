import React from "react";
import { Layers, CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface TagihanStatsProps {
  stats: {
    total: number;
    lunas: number;
    belum: number;
    pending: number;
  };
}

const TagihanStats: React.FC<TagihanStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-center items-start">
        <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
          <Layers size={20} />
        </div>
        <p className="text-2xl font-black text-dark">{stats.total}</p>
        <p className="text-sm font-bold text-dark/40">Total Tagihan</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-center items-start">
        <div className="mb-3 inline-flex rounded-xl bg-success/10 p-2 text-success">
          <CheckCircle size={20} />
        </div>
        <p className="text-2xl font-black text-dark">{stats.lunas}</p>
        <p className="text-sm font-bold text-dark/40">Lunas</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-center items-start">
        <div className="mb-3 inline-flex rounded-xl bg-danger/10 p-2 text-danger">
          <AlertTriangle size={20} />
        </div>
        <p className="text-2xl font-black text-dark">{stats.belum}</p>
        <p className="text-sm font-bold text-dark/40">Belum Bayar</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-center items-start">
        <div className="mb-3 inline-flex rounded-xl bg-warning/10 p-2 text-warning">
          <Clock size={20} />
        </div>
        <p className="text-2xl font-black text-dark">{stats.pending}</p>
        <p className="text-sm font-bold text-dark/40">Menunggu</p>
      </div>
    </div>
  );
};

export default TagihanStats;
