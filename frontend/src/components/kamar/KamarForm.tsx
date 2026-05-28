import type { KamarFormData, KamarStatus } from "../../types";
import KamarImageUpload from "./KamarImageUpload";

interface KamarFormProps {
  form: KamarFormData;
  errors: Partial<Record<keyof KamarFormData, string>>;
  preview: string | null;
  existingFoto?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const statusLabels: Record<KamarStatus, string> = {
  tersedia: "Tersedia",
  terisi: "Terisi",
  perbaikan: "Perbaikan",
};

const KamarForm = ({ form, errors, preview, existingFoto, onChange, onFotoChange }: KamarFormProps) => {
  const isStatusReadOnly = form.status_kamar === "terisi";

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Nomor Kamar *</label>
          <input
            name="nomor_kamar"
            value={form.nomor_kamar}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            placeholder="cth: 800000"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary ${errors.harga_bulanan ? "border-red-400" : "border-gray-200"}`}
          />
          {errors.harga_bulanan && <p className="text-xs text-red-500 mt-1">{errors.harga_bulanan}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Status Kamar *</label>
          {isStatusReadOnly ? (
            <span className="inline-flex min-h-[42px] items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-gray-600">
              {statusLabels[form.status_kamar]}
            </span>
          ) : (
            <select
              name="status_kamar"
              value={form.status_kamar}
              onChange={onChange}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary ${errors.status_kamar ? "border-red-400" : "border-gray-200"}`}
            >
              <option value="tersedia">{statusLabels.tersedia}</option>
              <option value="perbaikan">{statusLabels.perbaikan}</option>
            </select>
          )}
          {errors.status_kamar && <p className="text-xs text-red-500 mt-1">{errors.status_kamar}</p>}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Fasilitas Kamar *</label>
        <input
          name="fasilitas"
          value={form.fasilitas}
          onChange={onChange}
          placeholder="cth: AC, Kasur, WiFi, Lemari"
          className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary ${errors.fasilitas ? "border-red-400" : "border-gray-200"}`}
        />
        {errors.fasilitas && <p className="text-xs text-red-500 mt-1">{errors.fasilitas}</p>}
        <p className="text-xs text-gray-400 mt-1">Pisahkan setiap fasilitas dengan koma. cth: AC, Kasur, WiFi</p>
      </div>

      <KamarImageUpload preview={preview} existingFoto={existingFoto} onChange={onFotoChange} />
    </div>
  );
};

export default KamarForm;
