import { createContext, useEffect, useState, type ReactNode } from "react";
import type {
  User,
  AuthContextType,
  LoginResponse,
  ProfileResponse,
} from "../types";
import api from "../api/axios";

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = sessionStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get<ProfileResponse>("/profile");
        setUser(response.data.user);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
      } catch {
        setUser(null);
        sessionStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    await api.get("/sanctum/csrf-cookie", {
      baseURL: "",
    });

    const response = await api.post<LoginResponse>("/login", {
      email,
      password,
    });

    setUser(response.data.user);
    sessionStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data.user;
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await api.post("/logout");
    } catch (error) {
      console.log(error);
    } finally {
      setUser(null);
      sessionStorage.removeItem("user");
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};