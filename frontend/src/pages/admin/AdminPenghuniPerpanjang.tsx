import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import penghuniService from "../../services/penghuniService";

const AdminPenghuniPerpanjang = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [penghuni, setPenghuni] = useState<any>(null);
  const [durasi, setDurasi] = useState(1);
  const [tglMulai, setTglMulai] = useState("");
  const tglHariIni = new Date().toLocaleDateString("id-ID", { 
  day: "2-digit", month: "2-digit", year: "numeric" 
  }).split("/").reverse().join("-");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hargaBulanan = penghuni?.harga_bulanan ?? 0;
  const totalTagihan = hargaBulanan * durasi;

  const formatTanggal = (tanggal: string) => {
  if (!tanggal || tanggal === "-") return "-";
  const [year, month, day] = tanggal.split("-");
  return `${day}/${month}/${year}`;
};

  const estimasiCheckOut = (() => {
  const base = penghuni?.tanggal_keluar;
  if (!base || base === "-") return "-";
  const [year, month, day] = base.split("-").map(Number);
  const d = new Date(year, month - 1 + durasi, day);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
})();

  useEffect(() => {
    if (!id) return;
    penghuniService.getById(Number(id))
      .then((data: any) => {
  setPenghuni(data);
  if (data?.tanggal_keluar && data.tanggal_keluar !== "-") {
    setTglMulai(data.tanggal_keluar);
  } else {
    setTglMulai(new Date().toISOString().split("T")[0]);
  }
})
      .catch(() => {
        alert("Data tidak ditemukan.");
        navigate("/admin/penghuni");
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleSimpan = async () => {
  if (!penghuni) return;
  setIsSubmitting(true);
  try {
    await penghuniService.perpanjang(Number(id), {
      tanggal_mulai: tglMulai,
      durasi_sewa_bulan: durasi,  // ← pastikan nama field ini
      harga_deal: totalTagihan,
    });
    alert(`Berhasil memperpanjang sewa untuk ${penghuni.nama}`);
    navigate("/admin/penghuni");
  } catch (err: any) {
    alert(err?.response?.data?.message || "Gagal memperpanjang sewa.");
  } finally {
    setIsSubmitting(false);
  }
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
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <span className="cursor-pointer hover:text-primary transition" onClick={() => navigate("/admin/penghuni")}>
          Data Penghuni
        </span>
        <span>›</span>
        <span className="text-dark font-semibold">Perpanjang Sewa — {penghuni?.nama}</span>
      </div>

      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-2xl font-bold text-dark">Perpanjang Sewa</h1>
          <p className="text-sm text-gray-400 mt-1">
            Perpanjangan sewa untuk penghuni {penghuni?.nama} — Kamar {penghuni?.nomor_kamar}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/penghuni")}
          className="border border-gray-200 bg-white text-gray-500 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition"
        >
          ← Kembali
        </button>
      </div>

      {/* Info Penghuni */}
      <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 mb-5 flex flex-wrap gap-x-8 gap-y-3">
        {[
          { label: "Nama",          value: penghuni?.nama },
          { label: "Kamar",         value: `No. ${penghuni?.nomor_kamar}` },
          { label: "Tgl Masuk", value: formatTanggal(new Date().toISOString().split("T")[0]) },
          { label: "Tgl Keluar", value: formatTanggal(penghuni?.tanggal_keluar) },
          { label: "Harga / Bulan", value: `Rp ${hargaBulanan.toLocaleString("id-ID")}`, highlight: true },
].map((info) => (
          <div key={info.label}>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">{info.label}</p>
            <p className={`text-sm font-bold ${info.highlight ? "text-primary" : "text-dark"}`}>{info.value}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-dark">Detail Perpanjangan</p>
          <p className="text-xs text-gray-400 mt-0.5">Isi durasi perpanjangan sewa</p>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">
                Tanggal Mulai Perpanjang <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tglMulai}
                onChange={(e) => setTglMulai(e.target.value)}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">
                Durasi Perpanjangan (Bulan) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={durasi}
                onChange={(e) => setDurasi(Number(e.target.value))}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Tagihan Perpanjangan</p>
              <p className="text-xl font-bold text-primary">Rp {totalTagihan.toLocaleString("id-ID")}</p>
              <p className="text-[10px] text-gray-400 mt-1">
                Rp {hargaBulanan.toLocaleString("id-ID")} × {durasi} bulan
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-xl border border-blue-100 flex justify-between items-center">
              <p className="text-xs font-bold text-gray-600">Estimasi Check-Out Baru:</p>
              <p className="text-sm font-bold text-dark">{estimasiCheckOut}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => navigate("/admin/penghuni")}
            className="px-8 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSimpan}
            disabled={isSubmitting}
            className="px-10 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perpanjangan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPenghuniPerpanjang;