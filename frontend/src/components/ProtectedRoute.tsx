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
    <div className="flex h-screen overflow-hidden">
      <Sidebar display="hidden" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
