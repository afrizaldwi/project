import type { NotifikasiItem } from "../../types";

interface NotificationModalProps {
    notifications: NotifikasiItem[];
    showWhatsAppButton?: boolean;
    onClose: () => void;
    onMarkAsRead: (id: number) => Promise<void>;
    onMarkAllAsRead: () => Promise<void>;
}

const NotificationModal = ({
    notifications,
    showWhatsAppButton = false,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead,
}: NotificationModalProps) => {
    if (notifications.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Notifikasi Tagihan
                        </h2>
                        <p className="text-sm text-gray-500">
                            Peringatan otomatis untuk tagihan H-7 dan tagihan terlambat.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg border px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Tutup
                    </button>
                </div>

                <div className="max-h-[55vh] space-y-3 overflow-y-auto p-5">
                    {notifications.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-orange-200 bg-orange-50 p-4"
                        >
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="font-semibold text-orange-800">{item.judul}</p>
                                    <p className="mt-1 text-sm text-orange-700">{item.pesan}</p>

                                    {item.tagihan && (
                                        <div className="mt-3 text-xs text-gray-600">
                                            <p>Invoice: {item.tagihan.kode_invoice}</p>
                                            <p>Jatuh tempo: {item.tagihan.tanggal_jatuh_tempo}</p>
                                            <p>Status: {item.tagihan.status_tagihan}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex w-full shrink-0 flex-col gap-2 md:w-auto md:flex-row">
                                    {showWhatsAppButton &&
                                        item.role_target === "admin" &&
                                        item.tagihan?.whatsapp.enabled &&
                                        item.tagihan.whatsapp.url && (
                                            <a
                                                href={item.tagihan.whatsapp.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full rounded-lg bg-green-600 px-3 py-2 text-center text-xs font-medium text-white hover:bg-green-700 md:w-auto"
                                            >
                                                Kirim WA
                                            </a>
                                        )}

                                    <button
                                        onClick={() => onMarkAsRead(item.id)}
                                        className="w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-xs font-medium text-orange-700 hover:bg-orange-100 md:w-auto"
                                    >
                                        Tandai Dibaca
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col justify-end gap-3 border-t p-5 md:flex-row">
                    <button
                        onClick={onMarkAllAsRead}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 md:w-auto"
                    >
                        Tandai Semua Dibaca
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;