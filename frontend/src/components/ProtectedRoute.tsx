import type { ReactNode } from "react";
import useAuth from "../hook/useAuth";
import { Navigate } from "react-router-dom";
import type { User } from "../types";
import IsLoading from "./isLoading";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: User["role"];
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <IsLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
