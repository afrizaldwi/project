import { useState } from "react";
import { useNavigate } from "react-router-dom";
import kamarService from "../../services/kamarService";
import { type KamarFormData, defaultKamarForm } from "../../types";
import KamarForm from "../../components/kamar/KamarForm";

const AdminKamarTambah = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<KamarFormData>(defaultKamarForm());
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof KamarFormData, string>>>({});

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
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await kamarService.create(form);
      navigate("/admin/kamar");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message || "Gagal menyimpan kamar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-light p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <span className="cursor-pointer hover:text-primary transition" onClick={() => navigate("/admin/kamar")}>
          Data Kamar
        </span>
        <span>›</span>
        <span className="text-dark font-semibold">Tambah Kamar Baru</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Tambah Kamar Baru</h1>
          <p className="text-sm text-gray-400 mt-1">Isi detail kamar yang ingin ditambahkan</p>
        </div>
        <button
          onClick={() => navigate("/admin/kamar")}
          className="flex items-center gap-2 border border-gray-200 text-gray-500 text-sm font-semibold px-4 py-2 rounded-lg bg-white hover:opacity-80 transition"
        >
          ← Kembali
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-dark">Detail Kamar</p>
          <p className="text-xs text-gray-400 mt-0.5">Semua field bertanda * wajib diisi</p>
        </div>

        <KamarForm
          form={form}
          errors={errors}
          preview={preview}
          onChange={handleChange}
          onFotoChange={handleFotoChange}
        />

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={() => navigate("/admin/kamar")} className="border border-gray-200 text-gray-500 text-sm font-semibold px-5 py-2 rounded-lg bg-white hover:opacity-80">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? "Menyimpan..." : "Simpan Kamar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminKamarTambah;