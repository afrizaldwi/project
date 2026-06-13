import type { ChartOptions } from "chart.js";

export const dashboardChartOptions = {
    doughnut: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    } satisfies ChartOptions<"doughnut">,

    bar: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
        },

    } satisfies ChartOptions<"bar">,

    visitorBar: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    } satisfies ChartOptions<"bar">,

    visitorLine: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: (items) => {
                        const raw = items[0]?.label ?? "";
                        const date = new Date(raw);
                        if (!isNaN(date.getTime())) {
                            return date.toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            });
                        }
                        return raw;
                    },
                    label: (item) => ` ${item.raw} pengunjung`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    stepSize: 1,
                },
            },
            x: {
                ticks: {
                    maxRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 15,
                },
            },
        },
        interaction: {
            intersect: false,
            mode: "index" as const,
        },
    } satisfies ChartOptions<"line">,
};
