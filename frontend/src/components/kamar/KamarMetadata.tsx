interface KamarMetadataProps {
  createdAt: string | null;
  updatedAt: string | null;
}

const KamarMetadata = ({ createdAt, updatedAt }: KamarMetadataProps) => {
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center gap-6 bg-white border border-gray-100 rounded-xl px-5 py-3">
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
  );
};

export default KamarMetadata;
