import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import NotificationModal from "../../components/notifications/NotificationModal";
import { tagihanReminderApi } from "../../api/tagihanReminder";
import usePolling from "../../hook/usePolling";
import type {
  NotifikasiItem,
  PendingPembayaranItem,
  TagihanReminderItem,
} from "../../types";
import { isTagihanOpen, isTagihanPaid } from "../../utils/tagihanHelpers";

import TagihanStats from "../../components/tagihan/admin/TagihanStats";
import TagihanTable from "../../components/tagihan/admin/TagihanTable";
import PendingPaymentsTable from "../../components/tagihan/admin/PendingPaymentsTable";
import PaymentVerificationModal from "../../components/tagihan/admin/PaymentVerificationModal";

const POLLING_INTERVAL_MS = 5000;

const isUnauthorizedError = (error: unknown) => {
  return (error as { response?: { status?: number } })?.response?.status === 401;
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
      lunas: tagihan.filter((item) => isTagihanPaid(item)).length,
      belum: tagihan.filter((item) => isTagihanOpen(item)).length,
      pending: pendingPayments.length,
    };
  }, [tagihan, pendingPayments]);

  const fetchData = useCallback(async () => {
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
  }, []);

  const refreshPaymentData = useCallback(async () => {
    try {
      const [tagihanData, pendingData] = await Promise.all([
        tagihanReminderApi.getAdminTagihan(),
        tagihanReminderApi.getPendingPayments(),
      ]);

      setTagihan(tagihanData);
      setPendingPayments(pendingData);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        throw error;
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  usePolling(refreshPaymentData, {
    enabled: verifyingId === null,
    intervalMs: POLLING_INTERVAL_MS,
  });

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

      <TagihanStats stats={stats} />

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
          <TagihanTable tagihan={tagihan} isLoading={isLoading} />
        ) : (
          <PendingPaymentsTable
            pendingPayments={pendingPayments}
            isLoading={isLoading}
            onInspect={(payment) => {
              setPreview(payment);
              setCatatan("");
            }}
          />
        )}
      </div>

      {preview && (
        <PaymentVerificationModal
          preview={preview}
          catatan={catatan}
          onCatatanChange={setCatatan}
          onClose={() => setPreview(null)}
          onVerify={handleVerify}
          verifyingId={verifyingId}
        />
      )}
    </div>
  );
};

export default AdminTagihan;