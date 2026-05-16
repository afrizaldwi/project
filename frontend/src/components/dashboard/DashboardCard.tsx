type DashboardCardProps = {
    title: string;
    value: string | number;
};

const DashboardCard = ({ title, value }: DashboardCardProps) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{title}</p>

            <h2 className="mt-2 text-2xl font-bold text-gray-800">{value}</h2>
        </div>
    );
};

export default DashboardCard;