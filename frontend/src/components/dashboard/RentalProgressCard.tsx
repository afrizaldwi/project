type RentalProgressCardProps = {
    progress: number;
    sisaMasaSewa: string;
    durasiSewaBulan: number;
    statusSewa: string;
};

const RentalProgressCard = ({
    progress,
    sisaMasaSewa,
    durasiSewaBulan,
    statusSewa,
}: RentalProgressCardProps) => {
    const safeProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
                Progress Masa Sewa
            </h2>

            <div className="mb-4 flex items-end justify-between">
                <div>
                    <p className="mt-1 text-3xl font-bold text-gray-800">
                        {safeProgress}%
                    </p>
                </div>

                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                    {statusSewa}
                </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${safeProgress}%` }}
                />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-light p-3">
                    <p className="text-xs text-gray-500">Sisa Masa Sewa</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                        {sisaMasaSewa}
                    </p>
                </div>

                <div className="rounded-lg bg-light p-3">
                    <p className="text-xs text-gray-500">Durasi Kontrak</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                        {durasiSewaBulan} bulan
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RentalProgressCard;