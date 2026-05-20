import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  FileText,
  Upload,
  X,
  XCircle,
} from "lucide-react";

import NotificationModal from "../../components/notifications/NotificationModal";
import { tagihanReminderApi } from "../../api/tagihanReminder";
import type { NotifikasiItem, TagihanReminderItem } from "../../types";
import { downloadPdfBlob, invoiceApi } from "../../api/invoice";

const formatRupiah = (value: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (value: string) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getStatusConfig = (item: TagihanReminderItem) => {
  const paymentStatus = item.pembayaran_terbaru?.status_verifikasi;

  if (item.status_tagihan === "lunas" || paymentStatus === "diterima") {
    return {
      label: "Lunas",
      className: "bg-success/10 text-success",
      icon: <CheckCircle size={14} />,
    };
  }

  if (paymentStatus === "pending") {
    return {
      label: "Menunggu",
      className: "bg-warning/10 text-warning",
      icon: <Clock size={14} />,
    };
  }

  if (paymentStatus === "ditolak") {
    return {
      label: "Ditolak",
      className: "bg-danger/10 text-danger",
      icon: <XCircle size={14} />,
    };
  }

  if (item.status_tagihan === "telat") {
    return {
      label: "Telat",
      className: "bg-danger/10 text-danger",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (item.status_tagihan === "dibatalkan") {
    return {
      label: "Dibatalkan",
      className: "bg-dark/10 text-dark/50",
      icon: <XCircle size={14} />,
    };
  }

  return {
    label: "Belum Bayar",
    className: "bg-danger/10 text-danger",
    icon: <XCircle size={14} />,
  };
};

const canPay = (item: TagihanReminderItem) => {
  if (["lunas", "dibatalkan"].includes(item.status_tagihan)) return false;
  if (item.pembayaran_terbaru?.status_verifikasi === "pending") return false;
  return true;
};

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
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<number | null>(null);

  const activeTagihan = useMemo(() => {
    return tagihan.filter(
      (item) => !["lunas", "dibatalkan"].includes(item.status_tagihan)
    );
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

  const handleDownloadInvoicePdf = async (
    idPembayaran?: number | null,
    kodeInvoice?: string
  ) => {
    if (!idPembayaran) {
      alert("Invoice belum tersedia. Pembayaran harus diterima admin terlebih dahulu.");
      return;
    }

    try {
      setDownloadingInvoiceId(idPembayaran);

      const blob = await invoiceApi.downloadPenyewaInvoicePdf(idPembayaran);
      downloadPdfBlob(blob, `${kodeInvoice || `invoice-${idPembayaran}`}.pdf`);
    } catch {
      alert("Gagal download invoice PDF.");
    } finally {
      setDownloadingInvoiceId(null);
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

            {activeTagihan.length === 0 ? (
              <div className="rounded-2xl border border-success/20 bg-success/10 p-6 text-center shadow-sm">
                <CheckCircle className="mx-auto mb-3 text-success" size={32} />
                <p className="font-black text-dark">Semua tagihan sudah beres!</p>
                <p className="mt-1 text-sm font-medium text-dark/50">
                  Terima kasih telah membayar tepat waktu.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {activeTagihan.map((item) => {
                  const status = getStatusConfig(item);

                  return (
                    <div
                      key={item.id_tagihan}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-dark/40">
                            {item.kode_invoice}
                          </p>
                          <h3 className="mt-1 text-lg font-black text-dark">
                            Kamar {item.kamar.nomor_kamar || "-"}
                          </h3>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </div>

                      <div className="grid gap-3 rounded-xl bg-light p-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold uppercase text-dark/40">
                            Total Tagihan
                          </p>
                          <p className="mt-1 text-xl font-black text-dark">
                            {formatRupiah(item.total_tagihan)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase text-dark/40">
                            Jatuh Tempo
                          </p>
                          <p className="mt-1 font-black text-dark">
                            {formatDate(item.tanggal_jatuh_tempo)}
                          </p>
                        </div>
                      </div>

                      {item.pembayaran_terbaru?.status_verifikasi === "ditolak" &&
                        item.pembayaran_terbaru.catatan_admin && (
                          <div className="mt-4 rounded-xl border border-danger/20 bg-danger/10 p-3 text-sm font-semibold text-danger">
                            Catatan admin: {item.pembayaran_terbaru.catatan_admin}
                          </div>
                        )}

                      <button
                        type="button"
                        disabled={!canPay(item)}
                        onClick={() => openPaymentModal(item)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:bg-dark/20 disabled:shadow-none"
                      >
                        <Upload size={16} />
                        {item.pembayaran_terbaru?.status_verifikasi === "pending"
                          ? "Menunggu Verifikasi"
                          : "Bayar Sekarang"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-dark">Riwayat Pembayaran</h2>
              <p className="text-sm font-medium text-dark/40">
                Daftar tagihan yang sudah lunas.
              </p>
            </div>

            {riwayatPembayaran.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm font-semibold text-dark/50 shadow-sm">
                Belum ada riwayat pembayaran.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-[700px] w-full text-left text-sm">
                    <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
                      <tr>
                        <th className="px-5 py-4">Invoice</th>
                        <th className="px-5 py-4">Jatuh Tempo</th>
                        <th className="px-5 py-4">Total</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Aksi</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {riwayatPembayaran.map((item) => {
                        const status = getStatusConfig(item);

                        return (
                          <tr key={item.id_tagihan} className="hover:bg-light/70">
                            <td className="px-5 py-4">
                              <p className="font-black text-dark">{item.kode_invoice}</p>
                              <p className="text-xs font-medium text-dark/40">
                                Kamar {item.kamar.nomor_kamar || "-"}
                              </p>
                            </td>

                            <td className="px-5 py-4 font-medium text-dark/70">
                              {formatDate(item.tanggal_jatuh_tempo)}
                            </td>

                            <td className="px-5 py-4 font-black text-dark">
                              {formatRupiah(item.total_tagihan)}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase ${status.className}`}
                              >
                                {status.icon}
                                {status.label}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {item.pembayaran_terbaru?.status_verifikasi === "diterima" &&
                                item.pembayaran_terbaru?.id_pembayaran ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDownloadInvoicePdf(
                                      item.pembayaran_terbaru?.id_pembayaran,
                                      item.kode_invoice
                                    )
                                  }
                                  disabled={downloadingInvoiceId === item.pembayaran_terbaru.id_pembayaran}
                                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-black text-white transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Download size={14} />
                                  {downloadingInvoiceId === item.pembayaran_terbaru.id_pembayaran
                                    ? "..."
                                    : "PDF"}
                                </button>
                              ) : (
                                <span className="text-xs font-bold text-dark/30">Belum tersedia</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {showPaymentModal && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-dark">Konfirmasi Bayar</h3>

              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="rounded-full p-2 text-dark/40 hover:bg-light hover:text-dark"
              >
                <X size={18} />
              </button>
            </div>

            {successMessage ? (
              <div className="rounded-xl border border-success/20 bg-success/10 p-5 text-center">
                <CheckCircle className="mx-auto mb-3 text-success" size={32} />
                <p className="font-black text-dark">{successMessage}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-light p-4">
                  <p className="text-xs font-bold uppercase text-dark/40">
                    Total Tagihan
                  </p>
                  <p className="mt-1 text-2xl font-black text-dark">
                    {formatRupiah(selected.total_tagihan)}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-dark/70">
                    Metode Pembayaran
                  </label>
                  <select
                    value={metode}
                    onChange={(event) => setMetode(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-light p-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    <option value="transfer bank">Transfer Bank</option>
                    <option value="e-wallet">E-Wallet</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-dark/70">
                    Upload Bukti Bayar
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-light p-6 text-center transition-all hover:border-primary/40">
                    <CreditCard className="mb-2 text-primary" size={28} />
                    <p className="text-sm font-black text-dark">
                      {file ? file.name : "Pilih file bukti bayar"}
                    </p>
                    <p className="mt-1 text-xs font-medium text-dark/40">
                      JPG, PNG, atau PDF maksimal 5MB
                    </p>

                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview bukti bayar"
                    className="max-h-48 w-full rounded-xl object-cover"
                  />
                ) : file ? (
                  <div className="flex items-center gap-3 rounded-xl bg-light p-4">
                    <FileText className="text-primary" size={24} />
                    <p className="text-sm font-bold text-dark">{file.name}</p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleUploadPayment}
                  disabled={isUploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:opacity-70"
                >
                  <Upload size={16} />
                  {isUploading ? "Memproses..." : "Kirim Bukti Bayar"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PenyewaTagihan;