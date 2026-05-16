export interface User {
  id: number;
  namaLengkap: string;
  email: string;
  role: "admin" | "penyewa";
  noHp: string;
  fotoProfil: string | null;
  alamatAsal: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  role: User["role"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export interface LoginResponse {
  messagea: string;
  user: User;
  token: string;
}
export interface ProfleResponse {
  user: User;
}

export interface Tamu {
  id_tamu: number;
  nama_tamu: string;
  no_hp_tamu: string;
  id_user: number;
  keperluan: string;
  waktu_berkunjung: string;
  nama_penghuni: string;
  nomor_kamar: string;
}

export interface Kamar {
  id_user: number;
  nomor_kamar: string;
  penghuni: string;
}

export interface Kerusakan {
  id_keluhan: number;
  id_user: number;
  nama_penyewa: string;
  nomor_kamar: string;
  judul: string;
  deskripsi: string;
  foto: string | null;
  tanggal_lapor: string;
  status: "pending" | "proses" | "selesai";
}
