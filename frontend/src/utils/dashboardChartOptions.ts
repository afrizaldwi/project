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
};
