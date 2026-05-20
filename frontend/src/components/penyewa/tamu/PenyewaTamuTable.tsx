import type { Tamu } from "../../../types";
import { TableHead, TableCell } from "../../ui/Table";

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

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <p className="mt-1 font-semibold text-gray-900">{value || "-"}</p>
  </div>
);

interface PenyewaTamuTableProps {
  data: Tamu[];
}

export const PenyewaTamuTable = ({ data }: PenyewaTamuTableProps) => {
  return (
    <div className="mt-5">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-100 lg:block">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <TableHead>No</TableHead>
              <TableHead>Nama Tamu</TableHead>
              <TableHead>No. HP</TableHead>
              <TableHead>Keperluan</TableHead>
              <TableHead>Waktu</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((item, index) => (
              <tr key={item.id_tamu} className="hover:bg-gray-50">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nama_tamu}</TableCell>
                <TableCell>{item.no_hp_tamu}</TableCell>
                <TableCell>{item.keperluan}</TableCell>
                <TableCell>{formatTanggal(item.waktu_berkunjung)}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 lg:hidden">
        {data.map((item, index) => (
          <article
            key={item.id_tamu}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-xs font-semibold text-gray-400">#{index + 1}</p>
              <h3 className="mt-1 font-bold text-gray-900">{item.nama_tamu}</h3>
              <p className="text-sm text-gray-500">{item.no_hp_tamu}</p>
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <InfoItem label="Keperluan" value={item.keperluan} />
              <InfoItem label="Waktu" value={formatTanggal(item.waktu_berkunjung)} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PenyewaTamuTable;
