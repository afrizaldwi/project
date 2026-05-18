import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import sewaExtensionService from "../../services/sewaExtensionService";
import type { SewaExtensionDetail } from "../../types";

const formatTanggal = (value?: string | null) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const AdminPenghuni = () => {
  const navigate = useNavigate();

  const [sewaList, setSewaList] = useState<SewaExtensionDetail[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredSewa = useMemo(() => {
    const keyword = search.toLowerCase();

    return sewaList.filter((sewa) => {
      return (
        sewa.nama.toLowerCase().includes(keyword) ||
        sewa.email.toLowerCase().includes(keyword) ||
        sewa.nomor_kamar.toLowerCase().includes(keyword)
      );
    });
  }, [sewaList, search]);

  useEffect(() => {
    sewaExtensionService
      .getAll()
      .then((data) => {
        setSewaList(data);
      })
      .catch(() => {
        setError("Gagal memuat data penghuni aktif.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="space-y-6 p-6">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Data Penghuni
            </p>
            <h1 className="mt-2 text-2xl font-bold">Manajemen Penghuni Aktif</h1>
            <p className="mt-1 max-w-2xl text-sm text-blue-100">
              Halaman ini mengikuti tampilan fitur Ima sebagai placeholder integrasi.
              Pada branch Falissa, hanya aksi Perpanjang Sewa yang aktif.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white opacity-60"
            title="Tambah penghuni adalah scope Ima"
          >
            + Tambah Penghuni
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Penghuni Aktif" value={sewaList.length.toString()} />
        <StatCard
          label="Kamar Terisi"
          value={new Set(sewaList.map((sewa) => sewa.id_kamar)).size.toString()}
        />
        <StatCard label="Aksi Aktif" value="Perpanjang Sewa" />
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Daftar Penghuni Aktif</h2>
            <p className="text-sm text-gray-500">
              Detail, tambah, arsipkan, dan CRUD penghuni dinonaktifkan di branch ini.
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama, email, atau kamar..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 md:max-w-xs"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-6 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Memuat data penghuni aktif...
          </div>
        ) : filteredSewa.length === 0 ? (
          <div className="mt-6 rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
            Tidak ada data penghuni aktif.
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHead>Penghuni</TableHead>
                    <TableHead>Kamar</TableHead>
                    <TableHead>Tanggal Masuk</TableHead>
                    <TableHead>Tanggal Keluar</TableHead>
                    <TableHead>Harga Deal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredSewa.map((sewa) => (
                    <tr key={sewa.id_sewa} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900">{sewa.nama}</p>
                          <p className="text-xs text-gray-500">{sewa.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{sewa.nomor_kamar}</TableCell>
                      <TableCell>{formatTanggal(sewa.tanggal_masuk)}</TableCell>
                      <TableCell>{formatTanggal(sewa.tanggal_keluar)}</TableCell>
                      <TableCell>{formatRupiah(Number(sewa.harga_deal))}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Aktif
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <DisabledAction label="Detail" />
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/penghuni/perpanjang/${sewa.id_sewa}`)
                            }
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Perpanjang
                          </button>
                          <DisabledAction label="Arsipkan" />
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-100 md:hidden">
              {filteredSewa.map((sewa) => (
                <article key={sewa.id_sewa} className="space-y-3 p-4">
                  <div>
                    <p className="font-semibold text-gray-900">{sewa.nama}</p>
                    <p className="text-sm text-gray-500">{sewa.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <InfoItem label="Kamar" value={sewa.nomor_kamar} />
                    <InfoItem label="Status" value="Aktif" />
                    <InfoItem label="Masuk" value={formatTanggal(sewa.tanggal_masuk)} />
                    <InfoItem label="Keluar" value={formatTanggal(sewa.tanggal_keluar)} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <DisabledAction label="Detail" />
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/penghuni/perpanjang/${sewa.id_sewa}`)
                      }
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Perpanjang
                    </button>
                    <DisabledAction label="Arsipkan" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

interface TableTextProps {
  children: React.ReactNode;
}

const TableHead = ({ children }: TableTextProps) => (
  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
    {children}
  </th>
);

const TableCell = ({ children }: TableTextProps) => (
  <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
);

interface DisabledActionProps {
  label: string;
}

const DisabledAction = ({ label }: DisabledActionProps) => (
  <button
    type="button"
    disabled
    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-400"
    title={`${label} adalah scope fitur Ima`}
  >
    {label}
  </button>
);

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

export default AdminPenghuni;