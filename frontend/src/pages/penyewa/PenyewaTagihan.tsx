import { useEffect, useMemo, useState } from "react";
import NotificationModal from "../../components/notifications/NotificationModal";
import { tagihanReminderApi } from "../../api/tagihanReminder";
import type { NotifikasiItem, TagihanReminderItem } from "../../types";

const formatRupiah = (value: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const getStatusClass = (status: string) => {
  if (status === "lunas" || status === "dibayar") {
    return "bg-green-100 text-green-700";
  }

  if (status === "telat") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
};

const PenyewaTagihan = () => {
  const [tagihan, setTagihan] = useState<TagihanReminderItem[]>([]);
  const [notifications, setNotifications] = useState<NotifikasiItem[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const activeWarnings = useMemo(
    () => tagihan.filter((item) => item.peringatan.aktif),
    [tagihan]
  );

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
      notifications.map((item) =>
        tagihanReminderApi.markNotificationAsRead(item.id)
      )
    );

    setNotifications([]);
    setShowNotificationModal(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
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
          <h1 className="text-2xl font-bold text-gray-800">Tagihan Saya</h1>
          <p className="text-sm text-gray-500">
            Lihat status tagihan dan peringatan jatuh tempo.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => setShowNotificationModal(true)}
            className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
          >
            Notifikasi ({notifications.length})
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {activeWarnings.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <h2 className="font-bold text-orange-800">Peringatan Tagihan</h2>
          <div className="mt-3 space-y-2">
            {activeWarnings.map((item) => (
              <div key={item.id_tagihan} className="text-sm text-orange-700">
                <span className="font-medium">{item.kode_invoice}</span>:{" "}
                {item.peringatan.pesan}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Tagihan</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {tagihan.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Peringatan Aktif</p>
          <p className="mt-2 text-2xl font-bold text-orange-600">
            {activeWarnings.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Belum Lunas</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {
              tagihan.filter(
                (item) =>
                  item.status_tagihan !== "lunas" &&
                  item.status_tagihan !== "dibayar"
              ).length
            }
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {isLoading ? (
          <div className="rounded-xl border bg-white p-4 text-center text-sm text-gray-500">
            Memuat data...
          </div>
        ) : tagihan.length === 0 ? (
          <div className="rounded-xl border bg-white p-4 text-center text-sm text-gray-500">
            Belum ada tagihan.
          </div>
        ) : (
          tagihan.map((item) => (
            <div key={item.id_tagihan} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-800">{item.kode_invoice}</p>
                  <p className="text-xs text-gray-400">
                    Kamar {item.kamar.nomor_kamar || "-"}
                  </p>
                </div>

                {item.peringatan.aktif ? (
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${item.peringatan.status === "terlambat"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {item.peringatan.status === "terlambat"
                      ? "Terlambat"
                      : `H-${item.peringatan.hari_tersisa}`}
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                    Aman
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Total</span>
                  <span className="font-medium text-gray-800">
                    {formatRupiah(item.total_tagihan)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Jatuh Tempo</span>
                  <span className="font-medium text-gray-800">
                    {item.tanggal_jatuh_tempo}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                      item.status_tagihan
                    )}`}
                  >
                    {item.status_tagihan}
                  </span>
                </div>
              </div>

              {item.peringatan.aktif && (
                <div className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                  {item.peringatan.pesan}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Kamar</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Jatuh Tempo</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Peringatan</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : tagihan.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Belum ada tagihan.
                  </td>
                </tr>
              ) : (
                tagihan.map((item) => (
                  <tr key={item.id_tagihan} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.kode_invoice}
                    </td>

                    <td className="px-4 py-3">
                      {item.kamar.nomor_kamar || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {formatRupiah(item.total_tagihan)}
                    </td>

                    <td className="px-4 py-3">
                      {item.tanggal_jatuh_tempo}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                          item.status_tagihan
                        )}`}
                      >
                        {item.status_tagihan}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {item.peringatan.aktif ? (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${item.peringatan.status === "terlambat"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                            }`}
                        >
                          {item.peringatan.status === "terlambat"
                            ? "Terlambat"
                            : `H-${item.peringatan.hari_tersisa}`}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PenyewaTagihan;