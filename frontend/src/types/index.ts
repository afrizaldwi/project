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
export interface MeResponse {
  user: User;
}
