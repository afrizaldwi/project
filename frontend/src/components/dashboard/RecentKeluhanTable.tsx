type RecentKeluhan = {
    judul: string;
    status: "pending" | "proses" | "selesai";
    tanggal: string;
};

type RecentKeluhanTableProps = {
    keluhanList: RecentKeluhan[];
};

const getStatusBadgeClass = (status: RecentKeluhan["status"]) => {
    if (status === "pending") {
        return "bg-warning/10 text-warning";
    }

    if (status === "proses") {
        return "bg-primary/10 text-primary";
    }

    return "bg-success/10 text-success";
};

const getStatusLabel = (status: RecentKeluhan["status"]) => {
    if (status === "pending") {
        return "Menunggu";
    }

    if (status === "proses") {
        return "Diproses";
    }

    return "Selesai";
};

const RecentKeluhanTable = ({ keluhanList }: RecentKeluhanTableProps) => {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Keluhan Terbaru
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Daftar keluhan terbaru dari penghuni.
                    </p>
                </div>

                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                    {keluhanList.length} Keluhan
                </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-light">
                        <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                            <th className="px-4 py-3 font-semibold">Judul Keluhan</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Tanggal</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {keluhanList.length > 0 ? (
                            keluhanList.map((keluhan) => (
                                <tr
                                    key={`${keluhan.judul}-${keluhan.tanggal}`}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">
                                            {keluhan.judul}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                                                keluhan.status
                                            )}`}
                                        >
                                            {getStatusLabel(keluhan.status)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-gray-500">
                                        {keluhan.tanggal}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    Belum ada keluhan terbaru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentKeluhanTable;