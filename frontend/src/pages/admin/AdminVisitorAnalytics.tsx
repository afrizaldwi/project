import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import api from "../../api/axios";
import IsLoading from "../../components/IsLoading";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { dashboardChartOptions } from "../../utils/dashboardChartOptions";
import type { VisitorStatsResponse } from "../../types";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

const formatTopLocation = (stats: VisitorStatsResponse) => {
  const location = stats.top_location;

  if (location.total === 0) {
    return "Tidak diketahui";
  }

  return location.city + ", " + location.country;
};

const toDailyVisitorChart = (stats: VisitorStatsResponse): ChartData<"bar"> => ({
  labels: stats.daily_visitors.map((item) => item.date),
  datasets: [
    {
      label: "Pengunjung",
      data: stats.daily_visitors.map((item) => item.unique_visitors),
      backgroundColor: "rgba(37, 99, 235, 0.75)",
      borderWidth: 1,
    },
  ],
});

const toBrowserVisitorChart = (stats: VisitorStatsResponse): ChartData<"bar"> => ({
  labels: stats.browser_visitors.map((item) => item.browser_name),
  datasets: [
    {
      label: "Pengunjung",
      data: stats.browser_visitors.map((item) => item.unique_visitors),
      backgroundColor: "rgba(245, 158, 11, 0.78)",
      borderWidth: 1,
    },
  ],
});

const AdminVisitorAnalytics = () => {
  const [visitorStats, setVisitorStats] = useState<VisitorStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        const response = await api.get<VisitorStatsResponse>("/admin/visitor-stats");
        setVisitorStats(response.data);
      } catch {
        setError("Gagal mengambil data analitik pengunjung.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorStats();
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

  if (!visitorStats) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Data analitik pengunjung tidak tersedia.</p>
      </div>
    );
  }

  const visitorCards = [
    {
      title: "Total Pengunjung",
      value: formatNumber(visitorStats.total_unique_visitors),
    },
    {
      title: "Pengunjung Hari Ini",
      value: formatNumber(visitorStats.today_unique_visitors),
    },
    {
      title: "Lokasi Terbanyak",
      value: formatTopLocation(visitorStats),
    },
    {
      title: "Browser Terbanyak",
      value: visitorStats.top_browser.total > 0 ? visitorStats.top_browser.browser_name : "Tidak diketahui",
    },
  ];

  const dailyVisitorChartData = toDailyVisitorChart(visitorStats);
  const browserVisitorChartData = toBrowserVisitorChart(visitorStats);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analitik Pengunjung</h1>
        </div>

        <a
          href="/api/visitors/export.csv"
          className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
        >
          Unduh CSV Pengunjung
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visitorCards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Grafik Pengunjung Harian
          </h2>
          <div className="h-80">
            <Bar
              data={dailyVisitorChartData}
              options={dashboardChartOptions.visitorBar}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Browser Pengunjung
          </h2>
          <div className="h-80">
            <Bar
              data={browserVisitorChartData}
              options={dashboardChartOptions.visitorBar}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Lokasi Pengunjung
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Negara</th>
                  <th className="px-4 py-3 font-semibold">Kota</th>
                  <th className="px-4 py-3 font-semibold">Pengunjung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {visitorStats.location_visitors.map((item) => (
                  <tr key={item.country + "-" + item.city}>
                    <td className="px-4 py-3">{item.country}</td>
                    <td className="px-4 py-3">{item.city}</td>
                    <td className="px-4 py-3">{formatNumber(item.unique_visitors)}</td>
                  </tr>
                ))}
                {visitorStats.location_visitors.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-gray-500" colSpan={3}>
                      Data lokasi belum tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Ringkasan Persetujuan Cookie
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span>Analitik Diizinkan</span>
              <strong>{formatNumber(visitorStats.consent_summary.analytics_allowed)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span>Lokasi Diizinkan</span>
              <strong>{formatNumber(visitorStats.consent_summary.location_allowed)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span>Lokasi Ditolak</span>
              <strong>{formatNumber(visitorStats.consent_summary.location_rejected)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span>Browser Diizinkan</span>
              <strong>{formatNumber(visitorStats.consent_summary.browser_allowed)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Browser Ditolak</span>
              <strong>{formatNumber(visitorStats.consent_summary.browser_rejected)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Browser Pengunjung
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Browser</th>
                <th className="px-4 py-3 font-semibold">Pengunjung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {visitorStats.browser_visitors.map((item) => (
                <tr key={item.browser_name}>
                  <td className="px-4 py-3">{item.browser_name}</td>
                  <td className="px-4 py-3">{formatNumber(item.unique_visitors)}</td>
                </tr>
              ))}
              {visitorStats.browser_visitors.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-gray-500" colSpan={2}>
                    Data browser belum tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVisitorAnalytics;
