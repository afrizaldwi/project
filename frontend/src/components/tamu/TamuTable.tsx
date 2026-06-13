import type { Tamu } from "../../types";
import { TableHead, TableCell } from "../ui/Table";

const formatTanggal = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

interface TamuTableProps {
  data: Tamu[];
  startNumber?: number;
  onDelete: (id: number) => void;
}

export const TamuTable = ({ data, startNumber = 1, onDelete }: TamuTableProps) => {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-gray-100 lg:block">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <TableHead>No</TableHead>
            <TableHead>Nama Tamu</TableHead>
            <TableHead>Penghuni</TableHead>
            <TableHead>Kamar</TableHead>
            <TableHead>Keperluan</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Aksi</TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((item, index) => (
            <tr key={item.id_tamu} className="hover:bg-gray-50">
              <TableCell>{startNumber + index}</TableCell>
              <TableCell>
                <p className="font-semibold text-gray-900">{item.nama_tamu}</p>
                <p className="text-xs text-gray-500">{item.no_hp_tamu}</p>
              </TableCell>
              <TableCell>{item.nama_penghuni}</TableCell>
              <TableCell>{item.nomor_kamar}</TableCell>
              <TableCell>{item.keperluan}</TableCell>
              <TableCell>{formatTanggal(item.waktu_berkunjung)}</TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => onDelete(item.id_tamu)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  Hapus
                </button>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TamuTable;
