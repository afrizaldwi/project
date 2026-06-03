import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

import api from "../../api/axios";
import IsLoading from "../../components/IsLoading";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { dashboardCardAdapter } from "../../utils/dashboardCardAdapter";
import { dashboardChartAdapter } from "../../utils/dashboardChartAdapter";
import { dashboardChartOptions } from "../../utils/dashboardChartOptions";
import RecentKeluhanTable from "../../components/dashboard/RecentKeluhanTable";
import type { DashboardSummary } from "../../types";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const AdminDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await api.get<DashboardSummary>(
          "/admin/dashboard-summary"
        );

        setSummary(response.data);
      } catch {
        setError("Gagal mengambil data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  if (isLoading) {
    return <IsLoading />;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Data dashboard tidak tersedia.</p>
      </div>
    );
  }

  const cards = dashboardCardAdapter.toAdminDashboardCards(summary.cards);

  const statusKamarChartData = dashboardChartAdapter.toStatusKamarChart(
    summary.charts.status_kamar
  );

  const statusTagihanChartData = dashboardChartAdapter.toStatusTagihanChart(
    summary.charts.status_tagihan
  );

  const statusKeluhanChartData = dashboardChartAdapter.toStatusKeluhanChart(
    summary.charts.status_keluhan
  );


  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Ringkasan data operasional kost.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Status Kamar
          </h2>

          <div className="mx-auto h-72 max-w-72">
            <Doughnut
              data={statusKamarChartData}
              options={dashboardChartOptions.doughnut}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Status Tagihan
          </h2>

          <div className="mx-auto h-72 max-w-72">
            <Doughnut
              data={statusTagihanChartData}
              options={dashboardChartOptions.doughnut}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm ">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Status Keluhan
          </h2>

          <div className="mx-auto h-80 max-w-80">
            <Bar
              data={statusKeluhanChartData}
              options={dashboardChartOptions.bar}
            />
          </div>
        </div>
        <RecentKeluhanTable keluhanList={summary.recent_keluhan} />
      </div>
    </div>
  );
};

export default AdminDashboard;