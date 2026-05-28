import type { KamarStatus } from "../../types";

export const kamarStatusDisplay: Record<KamarStatus, { label: string; className: string; textClassName: string }> = {
  tersedia: {
    label: "Tersedia",
    className: "bg-light text-success",
    textClassName: "text-success",
  },
  terisi: {
    label: "Terisi",
    className: "bg-light text-danger",
    textClassName: "text-danger",
  },
  perbaikan: {
    label: "Perbaikan",
    className: "bg-light text-warning",
    textClassName: "text-warning",
  },
};

export const getKamarStatusDisplay = (status: KamarStatus) => kamarStatusDisplay[status];
