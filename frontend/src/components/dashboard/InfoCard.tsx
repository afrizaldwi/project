type InfoItem = {
    label: string;
    value: string | number | null;
};

type InfoCardProps = {
    title: string;
    description?: string;
    items: InfoItem[];
};

const InfoCard = ({ title, description, items }: InfoCardProps) => {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

                {description && (
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                    >
                        <p className="text-sm text-gray-500">{item.label}</p>

                        <p className="text-right text-sm font-semibold text-gray-800">
                            {item.value ?? "-"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoCard;