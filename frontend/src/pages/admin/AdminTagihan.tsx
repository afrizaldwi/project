import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Layers,
  MessageCircle,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";

import NotificationModal from "../../components/notifications/NotificationModal";
import { tagihanReminderApi } from "../../api/tagihanReminder";
import type {
  NotifikasiItem,
  PendingPembayaranItem,
  TagihanReminderItem,
} from "../../types";

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
    month: "short",
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

  return {
    label: "Belum Bayar",
    className: "bg-danger/10 text-danger",
    icon: <XCircle size={14} />,
  };
};

const AdminTagihan = () => {
  const [tagihan, setTagihan] = useState<TagihanReminderItem[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPembayaranItem[]>([]);
  const [notifications, setNotifications] = useState<NotifikasiItem[]>([]);
  const [activeTab, setActiveTab] = useState<"semua" | "pending">("semua");
  const [preview, setPreview] = useState<PendingPembayaranItem | null>(null);
  const [catatan, setCatatan] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const stats = useMemo(() => {
    return {
      total: tagihan.length,
      lunas: tagihan.filter((item) => item.status_tagihan === "lunas").length,
      belum: tagihan.filter((item) => item.status_tagihan !== "lunas").length,
      pending: pendingPayments.length,
    };
  }, [tagihan, pendingPayments]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [tagihanData, pendingData, notificationData] = await Promise.all([
        tagihanReminderApi.getAdminTagihan(),
        tagihanReminderApi.getPendingPayments(),
        tagihanReminderApi.getNotifications(true),
      ]);

      setTagihan(tagihanData);
      setPendingPayments(pendingData);
      setNotifications(notificationData);
      setShowNotificationModal(notificationData.length > 0);
    } catch {
      setErrorMessage("Gagal memuat data tagihan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunDueDateCheck = async () => {
    try {
      setIsChecking(true);
      await tagihanReminderApi.runDueDateCheck();
      await fetchData();
    } catch {
      alert("Gagal menjalankan pengecekan jatuh tempo.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleVerify = async (
    idPembayaran: number,
    action: "diterima" | "ditolak"
  ) => {
    try {
      setVerifyingId(idPembayaran);

      if (action === "diterima") {
        await tagihanReminderApi.verifyPayment(idPembayaran, catatan);
      } else {
        await tagihanReminderApi.rejectPayment(idPembayaran, catatan);
      }

      setPreview(null);
      setCatatan("");
      await fetchData();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal memproses pembayaran.");
    } finally {
      setVerifyingId(null);
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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Manajemen Tagihan</h1>
          <p className="mt-1 text-sm font-medium text-dark/50">
            Status hunian, notifikasi jatuh tempo, dan validasi bukti bayar.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => setShowNotificationModal(true)}
              className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-2 text-sm font-bold text-warning hover:bg-warning/20"
            >
              Notifikasi ({notifications.length})
            </button>
          )}

          <button
            type="button"
            onClick={handleRunDueDateCheck}
            disabled={isChecking}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-accent disabled:opacity-70"
          >
            <RefreshCw size={16} className={isChecking ? "animate-spin" : ""} />
            {isChecking ? "Mengecek..." : "Cek Jatuh Tempo"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm font-semibold text-danger">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
            <Layers size={20} />
          </div>
          <p className="text-2xl font-black text-dark">{stats.total}</p>
          <p className="text-sm font-bold text-dark/40">Total Tagihan</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-success/10 p-2 text-success">
            <CheckCircle size={20} />
          </div>
          <p className="text-2xl font-black text-dark">{stats.lunas}</p>
          <p className="text-sm font-bold text-dark/40">Lunas</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-danger/10 p-2 text-danger">
            <AlertTriangle size={20} />
          </div>
          <p className="text-2xl font-black text-dark">{stats.belum}</p>
          <p className="text-sm font-bold text-dark/40">Belum Bayar</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-warning/10 p-2 text-warning">
            <Clock size={20} />
          </div>
          <p className="text-2xl font-black text-dark">{stats.pending}</p>
          <p className="text-sm font-bold text-dark/40">Menunggu</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-dark">Daftar Tagihan</h2>
            <p className="text-sm font-medium text-dark/40">
              Kelola tagihan dan pembayaran penyewa.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 rounded-xl bg-light p-1 md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("semua")}
              className={`rounded-lg px-3 py-2 text-xs font-black transition-all md:px-5 ${activeTab === "semua"
                ? "bg-primary text-white shadow-sm"
                : "text-dark/40 hover:text-dark"
                }`}
            >
              Semua Tagihan
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`rounded-lg px-3 py-2 text-xs font-black transition-all md:px-5 ${activeTab === "pending"
                ? "bg-primary text-white shadow-sm"
                : "text-dark/40 hover:text-dark"
                }`}
            >
              Perlu Validasi
            </button>
          </div>
        </div>

        {activeTab === "semua" ? (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
                <tr>
                  <th className="px-5 py-4">Penyewa / Kamar</th>
                  <th className="px-5 py-4">Total Tagihan</th>
                  <th className="px-5 py-4">Jatuh Tempo</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={5}>
                      Memuat data...
                    </td>
                  </tr>
                ) : tagihan.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={5}>
                      Tidak ada data tagihan.
                    </td>
                  </tr>
                ) : (
                  tagihan.map((item) => {
                    const status = getStatusConfig(item);

                    return (
                      <tr key={item.id_tagihan} className="transition-colors hover:bg-light/70">
                        <td className="px-5 py-4">
                          <p className="font-black text-dark">
                            {item.penyewa.nama_lengkap || "-"}
                          </p>
                          <p className="text-xs font-medium text-dark/40">
                            Kamar {item.kamar.nomor_kamar || "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-black text-dark">
                          {formatRupiah(item.total_tagihan)}
                        </td>

                        <td className="px-5 py-4 font-medium text-dark/70">
                          {formatDate(item.tanggal_jatuh_tempo)}
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
                          {item.whatsapp.enabled && item.whatsapp.url ? (
                            <a
                              href={item.whatsapp.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-black text-success hover:bg-success/20"
                            >
                              <MessageCircle size={14} />
                              Kirim WA
                            </a>
                          ) : (
                            <span className="text-xs font-bold text-dark/30">
                              WA tidak tersedia
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-light text-[11px] uppercase tracking-wider text-dark/50">
                <tr>
                  <th className="px-5 py-4">Penyewa</th>
                  <th className="px-5 py-4">Jumlah Bayar</th>
                  <th className="px-5 py-4">Metode</th>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={5}>
                      Memuat data...
                    </td>
                  </tr>
                ) : pendingPayments.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center font-medium text-dark/50" colSpan={5}>
                      Tidak ada pembayaran yang menunggu validasi.
                    </td>
                  </tr>
                ) : (
                  pendingPayments.map((payment) => (
                    <tr
                      key={payment.id_pembayaran}
                      className="transition-colors hover:bg-light/70"
                    >
                      <td className="px-5 py-4">
                        <p className="font-black text-dark">
                          {payment.tagihan?.penyewa.nama_lengkap || "-"}
                        </p>
                        <p className="text-xs font-medium text-dark/40">
                          Kamar {payment.tagihan?.kamar.nomor_kamar || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-black text-dark">
                        {formatRupiah(payment.jumlah_bayar)}
                      </td>

                      <td className="px-5 py-4 font-medium capitalize text-dark/70">
                        {payment.metode_pembayaran}
                      </td>

                      <td className="px-5 py-4 font-medium text-dark/70">
                        {formatDate(payment.tanggal_bayar)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setPreview(payment);
                            setCatatan("");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/10 px-4 py-2 text-xs font-black text-warning hover:bg-warning/20"
                        >
                          <Eye size={14} />
                          Periksa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-dark">Verifikasi Pembayaran</h3>

              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-full p-2 text-dark/40 hover:bg-light hover:text-dark"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-light p-4">
                <p className="text-xs font-bold uppercase text-dark/40">Penyewa</p>
                <p className="mt-1 font-black text-dark">
                  {preview.tagihan?.penyewa.nama_lengkap || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-light p-4">
                  <p className="text-xs font-bold uppercase text-dark/40">Nominal</p>
                  <p className="mt-1 font-black text-dark">
                    {formatRupiah(preview.jumlah_bayar)}
                  </p>
                </div>

                <div className="rounded-xl bg-light p-4">
                  <p className="text-xs font-bold uppercase text-dark/40">Metode</p>
                  <p className="mt-1 font-black capitalize text-dark">
                    {preview.metode_pembayaran}
                  </p>
                </div>
              </div>

              {preview.bukti_bayar_url ? (
                <div className="space-y-3">
                  {/\.(jpg|jpeg|png|webp)$/i.test(preview.bukti_bayar_url) ? (
                    <a href={preview.bukti_bayar_url} target="_blank" rel="noreferrer">
                      <img
                        src={preview.bukti_bayar_url}
                        alt="Bukti pembayaran"
                        className="max-h-72 w-full rounded-xl border border-gray-100 object-contain"
                      />
                    </a>
                  ) : (
                    <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm font-semibold text-primary">
                      File bukti pembayaran bukan gambar. Buka file untuk melihat detail.
                    </div>
                  )}

                  <a
                    href={preview.bukti_bayar_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-primary/20 bg-primary/10 p-4 text-center text-sm font-black text-primary hover:bg-primary/20"
                  >
                    Buka Bukti Pembayaran
                  </a>
                </div>
              ) : (
                <div className="rounded-xl border border-warning/20 bg-warning/10 p-4 text-sm font-semibold text-warning">
                  Bukti pembayaran belum tersedia.
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-bold text-dark/70">
                  Catatan Tambahan
                </label>
                <textarea
                  value={catatan}
                  onChange={(event) => setCatatan(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Opsional..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={verifyingId === preview.id_pembayaran}
                  onClick={() => handleVerify(preview.id_pembayaran, "ditolak")}
                  className="rounded-xl border border-danger/20 px-4 py-3 text-xs font-black uppercase text-danger hover:bg-danger/10 disabled:opacity-60"
                >
                  Tolak
                </button>

                <button
                  type="button"
                  disabled={verifyingId === preview.id_pembayaran}
                  onClick={() => handleVerify(preview.id_pembayaran, "diterima")}
                  className="rounded-xl bg-success px-4 py-3 text-xs font-black uppercase text-white shadow-lg shadow-success/20 hover:bg-success/90 disabled:opacity-60"
                >
                  {verifyingId === preview.id_pembayaran ? "Memproses..." : "Terima"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTagihan;