import { Search } from "lucide-react";

interface InvoiceSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const InvoiceSearch = ({ search, onSearchChange }: InvoiceSearchProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-black text-dark">Invoice Transaksi</h2>
        <p className="text-sm font-medium text-dark/40">
          Data berasal dari pembayaran dengan status diterima.
        </p>
      </div>

      <div className="relative w-full md:max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30"
        />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari invoice, penyewa, kamar..."
          className="w-full rounded-xl border border-gray-200 bg-light py-2 pl-9 pr-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
};
