import { useContext } from "react";
import type { AuthContextType } from "../types";
import { AuthContext } from "../context/AuthContext";

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export default useAuth;
