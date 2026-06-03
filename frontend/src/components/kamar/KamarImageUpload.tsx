import { getStorageUrl } from "../../utils/storageUrl";

interface KamarImageUploadProps {
  preview: string | null;
  existingFoto?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const KamarImageUpload = ({ preview, existingFoto, onChange }: KamarImageUploadProps) => {
  const displayImage = preview || getStorageUrl(existingFoto);

  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5">Foto Kamar</label>
      <label className={`block border-2 border-dashed rounded-xl cursor-pointer overflow-hidden transition ${displayImage ? "border-primary" : "border-gray-200 hover:border-primary"}`}>
        {displayImage ? (
          <div className="w-full relative">
            <img src={displayImage} alt="Pratinjau" className="w-full h-auto object-contain bg-gray-100" />
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
              <span className="bg-white text-dark text-sm font-semibold px-4 py-2 rounded-lg">
                {existingFoto && !preview ? "Klik untuk ganti foto" : "Ganti Foto"}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-14 flex flex-col items-center bg-gray-50">
            <span className="text-4xl text-gray-300 mb-3">☁</span>
            <span className="text-sm text-gray-500">
              <span className="text-primary font-bold">Klik untuk unggah</span> atau seret dan lepas
            </span>
            <span className="text-xs text-gray-300 mt-1">PNG, JPG, JPEG maks. 2MB</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={onChange} className="hidden" />
      </label>
    </div>
  );
};

export default KamarImageUpload;
