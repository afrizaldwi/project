import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import penghuniService from "../../services/penghuniService";

const AdminPenghuniDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [penghuni, setPenghuni] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    penghuniService
      .getById(Number(id))
      .then(setPenghuni)
      .catch(() => {
        alert("Data tidak ditemukan.");
        navigate("/admin/penghuni");
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const formatTanggal = (tgl: string) => {
    if (!tgl || tgl === "-") return "-";

    const [year, month, day] = tgl.split("-");
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-screen">
        <p className="text-gray-400 text-sm">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-light p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <span
          className="cursor-pointer hover:text-primary transition"
          onClick={() => navigate("/admin/penghuni")}
        >
          Data Penghuni
        </span>

        <span>›</span>

        <span className="text-dark font-semibold">
          Detail — {penghuni?.nama}
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            Detail Penghuni
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Informasi lengkap penghuni dan data sewa
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/penghuni")}
            className="border border-gray-200 bg-white text-gray-500 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition"
          >
            ← Kembali
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informasi Pribadi */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-secondary">
            <p className="text-sm font-bold text-primary">
              Informasi Pribadi
            </p>
          </div>

          <div className="px-6 py-5 space-y-4">
            {[
              {
                label: "Nama Lengkap",
                value: penghuni?.nama,
              },
              {
                label: "Email",
                value: penghuni?.email,
              },
              {
                label: "No. HP",
                value: penghuni?.no_hp,
              },
              {
                label: "Alamat Asal",
                value: penghuni?.alamat_asal || "-",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-0.5"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {f.label}
                </p>

                <p className="text-sm font-bold text-dark">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Informasi Sewa */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-secondary">
            <p className="text-sm font-bold text-primary">
              Informasi Sewa
            </p>
          </div>

          <div className="px-6 py-5 space-y-4">
            {[
              {
                label: "Nomor Kamar",
                value: penghuni?.nomor_kamar,
              },
              {
                label: "Tanggal Masuk",
                value: formatTanggal(penghuni?.tanggal_masuk),
              },
              {
                label: "Tanggal Keluar",
                value: formatTanggal(penghuni?.tanggal_keluar),
              },
              {
                label: "Durasi Sewa",
                value: `${penghuni?.durasi_sewa_bulan} Bulan`,
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-0.5"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {f.label}
                </p>

                <p className="text-sm font-bold text-dark">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Informasi Pembayaran */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden md:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100 bg-secondary">
            <p className="text-sm font-bold text-primary">
              Informasi Pembayaran
            </p>
          </div>

          <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                label: "Harga / Bulan",
                value: `Rp ${Number(
                  penghuni?.harga_bulanan || 0
                ).toLocaleString("id-ID")}`,
                highlight: true,
              },
              {
                label: "Total Tagihan",
                value: `Rp ${Number(
                  penghuni?.harga_deal || 0
                ).toLocaleString("id-ID")}`,
                highlight: true,
              },
              {
                label: "Status Sewa",
                value:
                  penghuni?.status_sewa === "aktif"
                    ? "Aktif"
                    : "Non Aktif",
                color:
                  penghuni?.status_sewa === "aktif"
                    ? "text-green-600"
                    : "text-red-500",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-0.5"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {f.label}
                </p>

                <p
                  className={`text-sm font-bold ${
                    f.color ??
                    (f.highlight
                      ? "text-primary"
                      : "text-dark")
                  }`}
                >
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPenghuniDetail;