import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PenyewaDashboard from "./pages/penyewa/PenyewaDashboard";
import Landing from "./pages/Landing";
import PenyewaTagihan from "./pages/penyewa/PenyewaTagihan";
import PenyewaTamu from "./pages/penyewa/PenyewaTamu";
import PenyewaKeluhan from "./pages/penyewa/PenyewaKeluhan";
import PenyewaProfil from "./pages/penyewa/PenyewaProfil";
import AdminKamar from "./pages/admin/AdminKamar";
import AdminPenghuni from "./pages/admin/AdminPenghuni";
import AdminLaporanKeuangan from "./pages/admin/AdminLaporanKeuangan";
import AdminTagihan from "./pages/admin/AdminTagihan";
import AdminTamu from "./pages/admin/AdminTamu";
import AdminKeluhan from "./pages/admin/AdminKeluhan";
import AdminProfil from "./pages/admin/AdminProfil";
import AdminTambahPenghuni from "./pages/admin/AdminTambahPenghuni";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <Outlet />
            </ProtectedRoute>
          }>

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="kamar" element={<AdminKamar />} />
            <Route path="penghuni" element={<AdminPenghuni />} />
            <Route path="penghuni/tambah" element={<AdminTambahPenghuni />} />
            <Route path="laporan" element={<AdminLaporanKeuangan />} />
            <Route path="tagihan" element={<AdminTagihan />} />
            <Route path="tamu" element={<AdminTamu />} />
            <Route path="keluhan" element={<AdminKeluhan />} />
            <Route path="profil" element={<AdminProfil />} />
          </Route>

          <Route
            path="/penyewa"
            element={
              <ProtectedRoute role="penyewa">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<PenyewaDashboard />} />
            <Route path="tagihan" element={<PenyewaTagihan />} />
            <Route path="tamu" element={<PenyewaTamu />} />
            <Route path="keluhan" element={<PenyewaKeluhan />} />
            <Route path="profil" element={<PenyewaProfil />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
