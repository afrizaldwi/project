import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useEffect, useState, type FormEvent } from "react";
import IsLoading from "../components/IsLoading";

const Login = () => {
  const { login, isAuthenticated, role, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "penyewa") {
        navigate("/penyewa/dashboard", { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, role, navigate]);

  if (isLoading || isAuthenticated) {
    return <IsLoading />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoadingSubmit(true);

    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "penyewa") {
        navigate("/penyewa/dashboard", { replace: true });
      }
    } catch {
      setError("Email atau password salah.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoadingSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingSubmit ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;