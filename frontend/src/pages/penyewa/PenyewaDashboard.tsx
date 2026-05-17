import { useEffect, useState } from "react";

import api from "../../api/axios";
import IsLoading from "../../components/IsLoading";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { dashboardCardAdapter } from "../../utils/dashboardCardAdapter";
import type { PenyewaDashboardSummary } from "../../types";
import InfoCard from "../../components/dashboard/InfoCard";
import RentalProgressCard from "../../components/dashboard/RentalProgressCard";

const PenyewaDashboard = () => {
  const [summary, setSummary] = useState<PenyewaDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await api.get<PenyewaDashboardSummary>(
          "/penyewa/dashboard-summary"
        );

        setSummary(response.data);
      } catch (error) {
        console.log(error);
        setError("Gagal mengambil data dashboard penyewa.");
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

  const cards = dashboardCardAdapter.toPenyewaDashboardCards(summary.cards);

  const formatRupiah = (value: number | null) => {
    if (value === null) {
      return "-";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Penyewa Dashboard
      </h1>


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
        <InfoCard
          title="Informasi Kamar"
          items={[
            {
              label: "Nomor Kamar",
              value: summary.kamar?.nomor_kamar ?? "-",
            },
            {
              label: "Fasilitas",
              value: summary.kamar?.fasilitas ?? "-",
            },
            {
              label: "Harga Bulanan",
              value: formatRupiah(summary.kamar?.harga_bulanan ?? null),
            },
            {
              label: "Status Kamar",
              value: summary.kamar?.status_kamar ?? "-",
            },
          ]}
        />

        <InfoCard
          title="Informasi Kontrak"
          items={[
            {
              label: "Tanggal Masuk",
              value: summary.kontrak?.tanggal_masuk ?? "-",
            },
            {
              label: "Tanggal Keluar",
              value: summary.kontrak?.tanggal_keluar ?? "-",
            },
            {
              label: "Durasi Sewa",
              value: summary.kontrak
                ? `${summary.kontrak.durasi_sewa_bulan} bulan`
                : "-",
            },
            {
              label: "Status Sewa",
              value: summary.kontrak?.status_sewa ?? "-",
            },
          ]}
        />

        <InfoCard
          title="Tagihan Terbaru"
          items={[
            {
              label: "Kode Invoice",
              value: summary.tagihan_terbaru?.kode_invoice ?? "-",
            },
            {
              label: "Jatuh Tempo",
              value: summary.tagihan_terbaru?.tanggal_jatuh_tempo ?? "-",
            },
            {
              label: "Total Tagihan",
              value: formatRupiah(summary.tagihan_terbaru?.total_tagihan ?? null),
            },
            {
              label: "Status Tagihan",
              value: summary.tagihan_terbaru?.status_tagihan ?? "-",
            },
          ]}
        />

        <RentalProgressCard
          progress={summary.kontrak?.progress_persen ?? 0}
          sisaMasaSewa={summary.kontrak?.sisa_masa_sewa ?? "-"}
          durasiSewaBulan={summary.kontrak?.durasi_sewa_bulan ?? 0}
          statusSewa={summary.kontrak?.status_sewa ?? "-"}
        />
      </div>
    </div>
  );
};

export default PenyewaDashboard;