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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get<ProfileResponse>("/profile");
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await api.post<LoginResponse>("/login", {
      email,
      password,
    });

    setUser(response.data.user);

    return response.data.user;
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await api.post("/logout");
    } catch {
      // Frontend auth state should still be cleared if the cookie is already gone.
    } finally {
      setUser(null);
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
