import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  type ChartData,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import api from "../../api/axios";
import IsLoading from "../../components/IsLoading";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { dashboardChartOptions } from "../../utils/dashboardChartOptions";
import type { VisitorStatsResponse, VisitorPeriod, DailyVisitorItem } from "../../types";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler);

const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

const formatTopLocation = (stats: VisitorStatsResponse) => {
  const location = stats.top_location;

  if (location.total === 0) {
    return "Tidak diketahui";
  }

  return location.city + ", " + location.country;
};


const toDailyVisitorLineChart = (dailyVisitors: DailyVisitorItem[]): ChartData<"line"> => ({
  labels: dailyVisitors.map((item) => item.date),
  datasets: [
    {
      label: "Pengunjung",
      data: dailyVisitors.map((item) => item.unique_visitors),
      borderColor: "rgba(37, 99, 235, 1)",
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: "rgba(37, 99, 235, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
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

const PERIOD_OPTIONS: { value: VisitorPeriod; label: string }[] = [
  { value: "7", label: "7 Hari" },
  { value: "30", label: "30 Hari" },
  { value: "90", label: "90 Hari" },
  { value: "all", label: "Semua" },
];

const AdminVisitorAnalytics = () => {
  const [visitorStats, setVisitorStats] = useState<VisitorStatsResponse | null>(null);
  const [dailyVisitors, setDailyVisitors] = useState<DailyVisitorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visitorLoading, setVisitorLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<VisitorPeriod>("7");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchInitialStats = async () => {
      try {
        const response = await api.get<VisitorStatsResponse>("/admin/visitor-stats", {
          params: { period: "7" },
          signal: controller.signal,
        });
        setVisitorStats(response.data);
        setDailyVisitors(response.data.daily_visitors);
      } catch {
        if (!controller.signal.aborted) {
          setError("Gagal mengambil data analitik pengunjung.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialStats();

    return () => controller.abort();
  }, []);

  const fetchVisitorDailyStats = async (period: VisitorPeriod) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setVisitorLoading(true);

    try {
      const response = await api.get<{ daily_visitors: DailyVisitorItem[] }>("/admin/visitor-stats/daily", {
        params: { period },
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setDailyVisitors(response.data.daily_visitors);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Failed to fetch visitor daily stats:", err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setVisitorLoading(false);
      }
    }
  };

  const handlePeriodChange = (period: VisitorPeriod) => {
    if (period === selectedPeriod) return;
    setSelectedPeriod(period);
    fetchVisitorDailyStats(period);
  };

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

  const dailyVisitorChartData = toDailyVisitorLineChart(dailyVisitors);
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
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Grafik Pengunjung Harian
            </h2>
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1" role="group" aria-label="Periode pengunjung">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  id={`visitor-period-${option.value}`}
                  type="button"
                  onClick={() => handlePeriodChange(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${selectedPeriod === option.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-80">
            {visitorLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              </div>
            )}
            {dailyVisitors.length > 0 ? (
              <Line
                data={dailyVisitorChartData}
                options={dashboardChartOptions.visitorLine}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <p className="text-sm">Belum ada data pengunjung untuk periode ini</p>
              </div>
            )}
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
