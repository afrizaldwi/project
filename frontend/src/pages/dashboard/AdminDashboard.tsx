import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full min-h-screen">
      <h1>Admin Dashboard</h1>
      <p>{user?.namaLengkap}</p>
      <button
        className="px-4 py-2 rounded bg-blue-500 text-lg cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
