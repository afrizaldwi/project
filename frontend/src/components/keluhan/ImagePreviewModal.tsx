interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImagePreviewModal = ({ imageUrl, onClose }: ImagePreviewModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white shadow-md hover:bg-black/75 transition-colors focus:outline-none z-10 text-xs font-bold cursor-pointer"
          title="Tutup"
        >
          ✕
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Preview Kerusakan"
          className="max-w-full max-h-[80vh] rounded-xl object-contain"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
