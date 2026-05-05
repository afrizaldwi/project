import useAuth from "../../hook/useAuth";
const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center flex-col w-full min-h-screen">
      <h1>Admin Dashboard</h1>
      <p>{user?.namaLengkap}</p>
    </div>
  );
};

export default AdminDashboard;
