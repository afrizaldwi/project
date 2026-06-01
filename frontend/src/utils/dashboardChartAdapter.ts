import type { ChartData } from "chart.js";
import { getCssVariable } from "./getCssVariable";

type StatusKamar = {
    tersedia: number;
    terisi: number;
    perbaikan: number;
};

type StatusTagihan = {
    belum_bayar: number;
    lunas: number;
    telat: number;
};

type StatusKeluhan = {
    pending: number;
    proses: number;
    selesai: number;
};

export const dashboardChartAdapter = {
    toStatusKamarChart(statusKamar: StatusKamar): ChartData<"doughnut"> {
        return {
            labels: ["Tersedia", "Terisi", "Perbaikan"],
            datasets: [
                {
                    label: "Status Kamar",
                    data: [
                        statusKamar.tersedia,
                        statusKamar.terisi,
                        statusKamar.perbaikan,
                    ],
                    backgroundColor: [
                        getCssVariable("--color-success"),
                        getCssVariable("--color-primary"),
                        getCssVariable("--color-warning"),],
                    borderWidth: 1,
                },
            ],
        };
    },

    toStatusTagihanChart(statusTagihan: StatusTagihan): ChartData<"doughnut"> {
        return {
            labels: ["Belum Bayar", "Lunas", "Telat"],
            datasets: [
                {
                    label: "Status Tagihan",
                    data: [
                        statusTagihan.belum_bayar,
                        statusTagihan.lunas,
                        statusTagihan.telat,
                    ],
                    backgroundColor: [
                        getCssVariable("--color-warning"),
                        getCssVariable("--color-success"),
                        getCssVariable("--color-danger"),
                    ],
                    borderWidth: 1,
                },
            ],
        };
    },

    toStatusKeluhanChart(statusKeluhan: StatusKeluhan): ChartData<"bar"> {
        return {
            labels: ["Menunggu", "Proses", "Selesai"],
            datasets: [
                {
                    label: "Jumlah Keluhan",
                    data: [
                        statusKeluhan.pending,
                        statusKeluhan.proses,
                        statusKeluhan.selesai,
                    ],
                    backgroundColor: [
                        getCssVariable("--color-warning"),
                        getCssVariable("--color-primary"),
                        getCssVariable("--color-success"),
                    ],
                    borderWidth: 1,
                },
            ],
        };
    },
};