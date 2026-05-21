import React from "react";
import { CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import type { TagihanReminderItem } from "../types";

export const formatRupiah = (value: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

export const formatDate = (value: string, longMonth: boolean = false) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: longMonth ? "long" : "short",
    year: "numeric",
  });
};

export const getStatusConfig = (item: TagihanReminderItem) => {
  const paymentStatus = item.pembayaran_terbaru?.status_verifikasi;

  if (item.status_tagihan === "lunas" || paymentStatus === "diterima") {
    return {
      label: "Lunas",
      className: "bg-success/10 text-success",
      icon: React.createElement(CheckCircle, { size: 14 }),
    };
  }

  if (paymentStatus === "pending") {
    return {
      label: "Menunggu",
      className: "bg-warning/10 text-warning",
      icon: React.createElement(Clock, { size: 14 }),
    };
  }

  if (paymentStatus === "ditolak") {
    return {
      label: "Ditolak",
      className: "bg-danger/10 text-danger",
      icon: React.createElement(XCircle, { size: 14 }),
    };
  }

  if (item.status_tagihan === "dibatalkan") {
    return {
      label: "Dibatalkan",
      className: "bg-gray-100 text-gray-700",
    };
  }

  if (item.status_tagihan === "telat") {
    return {
      label: "Telat",
      className: "bg-danger/10 text-danger",
      icon: React.createElement(AlertTriangle, { size: 14 }),
    };
  }

  return {
    label: "Belum Bayar",
    className: "bg-danger/10 text-danger",
    icon: React.createElement(XCircle, { size: 14 }),
  };
};
