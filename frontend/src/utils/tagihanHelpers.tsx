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

const paymentStatus = (item: TagihanReminderItem) =>
  item.pembayaran_terbaru?.status_verifikasi;

export const isTagihanPaid = (item: TagihanReminderItem) =>
  item.status_tagihan === "lunas" || paymentStatus(item) === "diterima";

export const isTagihanCanceled = (item: TagihanReminderItem) =>
  item.status_tagihan === "dibatalkan";

export const isTagihanOpen = (item: TagihanReminderItem) =>
  !isTagihanPaid(item) && !isTagihanCanceled(item);

const isPastDue = (value: string) => {
  if (!value) return false;

  const dueDate = new Date(value);
  if (Number.isNaN(dueDate.getTime())) return false;

  dueDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dueDate < today;
};

export const getStatusConfig = (item: TagihanReminderItem) => {
  const latestPaymentStatus = paymentStatus(item);

  if (isTagihanPaid(item)) {
    return {
      label: "Lunas",
      className: "bg-success/10 text-success",
      icon: React.createElement(CheckCircle, { size: 14 }),
    };
  }

  if (latestPaymentStatus === "pending") {
    return {
      label: "Menunggu",
      className: "bg-warning/10 text-warning",
      icon: React.createElement(Clock, { size: 14 }),
    };
  }

  if (latestPaymentStatus === "ditolak") {
    return {
      label: "Ditolak",
      className: "bg-danger/10 text-danger",
      icon: React.createElement(XCircle, { size: 14 }),
    };
  }

  if (isTagihanCanceled(item)) {
    return {
      label: "Dibatalkan",
      className: "bg-gray-100 text-gray-700",
    };
  }

  if (item.status_tagihan === "telat" || isPastDue(item.tanggal_jatuh_tempo)) {
    return {
      label: "Telat",
      className: "bg-danger/10 text-danger",
      icon: React.createElement(AlertTriangle, { size: 14 }),
    };
  }

  return {
    label: "Belum Bayar",
    className: "bg-warning/10 text-warning",
    icon: React.createElement(XCircle, { size: 14 }),
  };
};
