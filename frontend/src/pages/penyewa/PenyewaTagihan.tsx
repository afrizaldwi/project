import { useEffect, useMemo, useState } from "react";

import NotificationModal from "../../components/notifications/NotificationModal";
import { tagihanReminderApi } from "../../api/tagihanReminder";
import type { NotifikasiItem, TagihanReminderItem } from "../../types";

import ActiveTagihanCard from "../../components/tagihan/penyewa/ActiveTagihanCard";
import RiwayatPembayaranTable from "../../components/tagihan/penyewa/RiwayatPembayaranTable";
import PaymentUploadModal from "../../components/tagihan/penyewa/PaymentUploadModal";

const PenyewaTagihan = () => {
  const [tagihan, setTagihan] = useState<TagihanReminderItem[]>([]);
  const [notifications, setNotifications] = useState<NotifikasiItem[]>([]);
  const [selected, setSelected] = useState<TagihanReminderItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [metode, setMetode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const activeTagihan = useMemo(() => {
    return tagihan.filter((item) => item.status_tagihan !== "lunas");
  }, [tagihan]);

  const riwayatPembayaran = useMemo(() => {
    return tagihan.filter((item) => item.status_tagihan === "lunas");
  }, [tagihan]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [tagihanData, notificationData] = await Promise.all([
        tagihanReminderApi.getPenyewaTagihan(),
        tagihanReminderApi.getNotifications(true),
      ]);

      setTagihan(tagihanData);
      setNotifications(notificationData);
      setShowNotificationModal(notificationData.length > 0);
    } catch {
      setErrorMessage("Gagal memuat tagihan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPaymentModal = (item: TagihanReminderItem) => {
    setSelected(item);
    setShowPaymentModal(true);
    setMetode("");
    setFile(null);
    setFilePreview(null);
    setSuccessMessage("");
  };

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      alert("Format file tidak valid. Gunakan JPG, PNG, atau PDF.");
      event.target.value = "";
      setFile(null);
      setFilePreview(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      alert(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`);
      event.target.value = "";
      setFile(null);
      setFilePreview(null);
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }
  };

  const handleUploadPayment = async () => {
    if (!selected) return;

    if (!metode || !file) {
      alert("Lengkapi metode pembayaran dan bukti bayar.");
      return;
    }

    try {
      setIsUploading(true);

      const payload = new FormData();
      payload.append("metode_pembayaran", metode);
      payload.append("bukti_bayar", file);

      await tagihanReminderApi.uploadPaymentProof(selected.id_tagihan, payload);

      setSuccessMessage("Bukti pembayaran berhasil dikirim. Menunggu verifikasi admin.");
      await fetchData();

      setTimeout(() => {
        setShowPaymentModal(false);
        setSelected(null);
        setMetode("");
        setFile(null);
        setFilePreview(null);
        setSuccessMessage("");
      }, 1200);
    } catch (error: any) {
      console.error("Upload payment proof error:", error);

      const validationErrors = error?.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0] as string[];
        alert(firstError?.[0] || "Validasi bukti pembayaran gagal.");
      } else if (error?.response?.status === 413) {
        alert("Ukuran file terlalu besar untuk diunggah.");
      } else if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error?.message) {
        alert(`Gagal mengirim bukti pembayaran: ${error.message}`);
      } else {
        alert("Gagal mengirim bukti pembayaran.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    await tagihanReminderApi.markNotificationAsRead(id);

    setNotifications((previous) => {
      const updated = previous.filter((item) => item.id !== id);

      if (updated.length === 0) {
        setShowNotificationModal(false);
      }

      return updated;
    });
  };

  const handleMarkAllAsRead = async () => {
    await Promise.all(
      notifications.map((item) => tagihanReminderApi.markNotificationAsRead(item.id))
    );

    setNotifications([]);
    setShowNotificationModal(false);
  };

  return (
    <div className="space-y-6 bg-light p-4 md:p-6">
      {showNotificationModal && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowNotificationModal(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Tagihan Saya</h1>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Lihat dan bayar tagihan kost kamu.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={() => setShowNotificationModal(true)}
            className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-2 text-sm font-bold text-warning hover:bg-warning/20"
          >
            Notifikasi ({notifications.length})
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm font-semibold text-dark/50 shadow-sm">
          Memuat data tagihan...
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-dark">Tagihan Aktif</h2>
              <p className="text-sm font-medium text-dark/40">
                Tagihan yang belum lunas atau sedang menunggu verifikasi.
              </p>
            </div>

            <ActiveTagihanCard activeTagihan={activeTagihan} onPay={openPaymentModal} />
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-dark">Riwayat Pembayaran</h2>
              <p className="text-sm font-medium text-dark/40">
                Daftar tagihan yang sudah lunas.
              </p>
            </div>

            <RiwayatPembayaranTable riwayatPembayaran={riwayatPembayaran} />
          </section>
        </>
      )}

      {showPaymentModal && selected && (
        <PaymentUploadModal
          selected={selected}
          metode={metode}
          onMetodeChange={setMetode}
          file={file}
          filePreview={filePreview}
          onFileChange={handleFileChange}
          onClose={() => setShowPaymentModal(false)}
          onUpload={handleUploadPayment}
          isUploading={isUploading}
          successMessage={successMessage}
        />
      )}
    </div>
  );
};

export default PenyewaTagihan;