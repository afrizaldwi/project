import type { ReactNode } from "react";
import useAuth from "../hook/useAuth";
import { Navigate } from "react-router-dom";
import type { User } from "../types";
import Sidebar from "./navigation/Sidebar";
import Navbar from "./navigation/Navbar";
import IsLoading from "./IsLoading";

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

  return (
    <div className="flex">
      <Sidebar display="hidden" />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="min-h-screen bg-light lg:ml-[20%]">{children}</main>
      </div>
    </div>
  );
};

export default ProtectedRoute;