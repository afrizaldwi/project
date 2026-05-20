import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import kamarService from "../../services/kamarService";
import type { KamarFormData } from "../../types";
import KamarForm from "../../components/kamar/KamarForm";
import KamarMetadata from "../../components/kamar/KamarMetadata";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-screen">
        <p className="text-gray-400 text-sm">Memuat data kamar...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-light p-6">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <span className="cursor-pointer hover:text-primary transition" onClick={() => navigate("/admin/kamar")}>
          Data Kamar
        </span>
        <span>›</span>
        <span className="text-dark font-semibold">Edit Kamar — No. {form.nomor_kamar}</span>
      </div>

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

      <div className="mb-5">
        <KamarMetadata createdAt={createdAt} updatedAt={updatedAt} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-dark">Detail Kamar</p>
          <p className="text-xs text-gray-400 mt-0.5">Semua field bertanda * wajib diisi</p>
        </div>

        <KamarForm
          form={form}
          errors={errors}
          preview={preview}
          existingFoto={existingFoto}
          onChange={handleChange}
          onFotoChange={handleFotoChange}
        />

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
