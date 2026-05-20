import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import kamarService from "../../services/kamarService";
import type { KamarFormData } from "../../types";

const AdminKamarEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<KamarFormData>({
    nomor_kamar: "",
    luas_kamar: "",
    fasilitas: "",
    harga_bulanan: "",
    status_kamar: "tersedia",
    foto_kamar: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [existingFoto, setExistingFoto] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof KamarFormData, string>>>({});

  useEffect(() => {
    const fetchKamar = async () => {
      if (!id) return;
      try {
        const kamar = await kamarService.getById(Number(id));
        const fasilitasStr = (() => {
          try {
            const arr = JSON.parse(kamar.fasilitas);
            return Array.isArray(arr) ? arr.join(", ") : kamar.fasilitas;
          } catch {
            return kamar.fasilitas || "";
          }
        })();
        setForm({
          nomor_kamar: kamar.nomor_kamar,
          luas_kamar: kamar.luas_kamar,
          fasilitas: fasilitasStr,
          harga_bulanan: String(kamar.harga_bulanan),
          status_kamar: kamar.status_kamar,
          foto_kamar: null,
        });
        setExistingFoto(kamar.foto_kamar);
        setCreatedAt(kamar.created_at);
        setUpdatedAt(kamar.updated_at);
      } catch {
        alert("Kamar tidak ditemukan.");
        navigate("/admin/kamar");
      } finally {
        setIsLoading(false);
      }
    };
    fetchKamar();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, foto_kamar: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof KamarFormData, string>> = {};
    if (!form.nomor_kamar.trim()) newErrors.nomor_kamar = "Nomor kamar wajib diisi.";
    if (!form.luas_kamar.trim()) newErrors.luas_kamar = "Ukuran kamar wajib diisi.";
    if (!form.harga_bulanan) newErrors.harga_bulanan = "Harga wajib diisi.";
    if (!form.fasilitas.trim()) newErrors.fasilitas = "Fasilitas wajib diisi.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !id) return;
    setIsSubmitting(true);
    try {
      await kamarService.update(Number(id), form);
      navigate("/admin/kamar");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-screen">
        <p className="text-gray-400 text-sm">Memuat data kamar...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-light p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <span className="cursor-pointer hover:text-primary transition" onClick={() => navigate("/admin/kamar")}>
          Data Kamar
        </span>
        <span>›</span>
        <span className="text-dark font-semibold">Edit Kamar — No. {form.nomor_kamar}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-dark">Edit Kamar</h1>
          <p className="text-sm text-gray-400 mt-1">Perbarui detail kamar No. {form.nomor_kamar}</p>
        </div>
        <button
          onClick={() => navigate("/admin/kamar")}
          className="flex items-center gap-2 border border-gray-200 text-gray-500 text-sm font-semibold px-4 py-2 rounded-lg bg-white hover:opacity-80 transition"
        >
          ← Kembali
        </button>
      </div>

      {/* Timestamp Bar */}
      <div className="flex items-center gap-6 bg-white border border-gray-100 rounded-xl px-5 py-3 mb-5">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Ditambahkan</p>
          <p className="text-sm font-bold text-gray-600">{formatDateTime(createdAt)}</p>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Terakhir Diedit</p>
          <p className="text-sm font-bold text-gray-600">{formatDateTime(updatedAt)}</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-dark">Detail Kamar</p>
          <p className="text-xs text-gray-400 mt-0.5">Semua field bertanda * wajib diisi</p>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Nomor Kamar *</label>
              <input
                name="nomor_kamar"
                value={form.nomor_kamar}
                onChange={handleChange}
                placeholder="cth: A1"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary ${errors.nomor_kamar ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.nomor_kamar && <p className="text-xs text-red-500 mt-1">{errors.nomor_kamar}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Ukuran Kamar *</label>
              <input
                name="luas_kamar"
                value={form.luas_kamar}
                onChange={handleChange}
                placeholder="cth: 3x4 m"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary ${errors.luas_kamar ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.luas_kamar && <p className="text-xs text-red-500 mt-1">{errors.luas_kamar}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Harga / Bulan *</label>
              <input
                name="harga_bulanan"
                type="number"
                value={form.harga_bulanan}
                onChange={handleChange}
                placeholder="cth: 800000"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary ${errors.harga_bulanan ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.harga_bulanan && <p className="text-xs text-red-500 mt-1">{errors.harga_bulanan}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Status Kamar *</label>
              <select
                name="status_kamar"
                value={form.status_kamar}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="tersedia">Tersedia</option>
                <option value="terisi">Terisi</option>
              </select>
            </div>
          </div>

          {/* Fasilitas */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Fasilitas Kamar *</label>
            <input
              name="fasilitas"
              value={form.fasilitas}
              onChange={handleChange}
              placeholder="cth: AC, Kasur, WiFi, Lemari"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary ${errors.fasilitas ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.fasilitas && <p className="text-xs text-red-500 mt-1">{errors.fasilitas}</p>}
            <p className="text-xs text-gray-400 mt-1">Pisahkan setiap fasilitas dengan koma. cth: AC, Kasur, WiFi</p>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Foto Kamar</label>
            <label className={`block border-2 border-dashed rounded-xl cursor-pointer overflow-hidden transition ${preview || existingFoto ? "border-primary" : "border-gray-200 hover:border-primary"}`}>
              {preview ? (
                <div className="w-full relative">
                  <img src={preview} alt="Preview baru" className="w-full h-auto object-contain bg-gray-100" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                    <span className="bg-white text-dark text-sm font-semibold px-4 py-2 rounded-lg">Ganti Foto</span>
                  </div>
                </div>
              ) : existingFoto ? (
                <div className="w-full relative">
                  <img src={`http://localhost:8000/storage/${existingFoto}`} alt="Foto saat ini" className="w-full h-auto object-contain bg-gray-100" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                    <span className="bg-white text-dark text-sm font-semibold px-4 py-2 rounded-lg">Klik untuk ganti foto</span>
                  </div>
                </div>
              ) : (
                <div className="py-14 flex flex-col items-center bg-gray-50">
                  <span className="text-4xl text-gray-300 mb-3">☁</span>
                  <span className="text-sm text-gray-500">
                    <span className="text-primary font-bold">Klik untuk upload</span>
                  </span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={() => navigate("/admin/kamar")} className="border border-gray-200 text-gray-500 text-sm font-semibold px-5 py-2 rounded-lg bg-white hover:opacity-80">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminKamarEdit;