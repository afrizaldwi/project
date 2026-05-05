import { createContext, useEffect, useState, type ReactNode } from "react";
import type {
  User,
  AuthContextType,
  LoginResponse,
  ProfleResponse,
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get<ProfleResponse>("/profile");
        setUser(response.data.user);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        console.log(error);
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

    console.log("response:", response.data);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
