import { Suspense, lazy } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import IsLoading from "./components/IsLoading";

const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const PenyewaDashboard = lazy(() => import("./pages/penyewa/PenyewaDashboard"));
const Landing = lazy(() => import("./pages/Landing"));
const PenyewaTagihan = lazy(() => import("./pages/penyewa/PenyewaTagihan"));
const PenyewaTamu = lazy(() => import("./pages/penyewa/PenyewaTamu"));
const PenyewaKeluhan = lazy(() => import("./pages/penyewa/PenyewaKeluhan"));
const PenyewaProfil = lazy(() => import("./pages/penyewa/PenyewaProfil"));
const AdminKamar = lazy(() => import("./pages/admin/AdminKamar"));
const AdminPenghuni = lazy(() => import("./pages/admin/AdminPenghuni"));
const AdminLaporanKeuangan = lazy(() => import("./pages/admin/AdminLaporanKeuangan"));
const AdminTagihan = lazy(() => import("./pages/admin/AdminTagihan"));
const AdminTamu = lazy(() => import("./pages/admin/AdminTamu"));
const AdminKeluhan = lazy(() => import("./pages/admin/AdminKeluhan"));
const AdminProfil = lazy(() => import("./pages/admin/AdminProfil"));
const AdminTambahPenghuni = lazy(() => import("./pages/admin/AdminTambahPenghuni"));
const AdminKamarTambah = lazy(() => import("./pages/admin/AdminKamarTambah"));
const AdminKamarEdit = lazy(() => import("./pages/admin/AdminKamarEdit"));
const AdminPenghuniPerpanjang = lazy(() => import("./pages/admin/AdminPenghuniPerpanjang"));
const AdminVisitorAnalytics = lazy(() => import("./pages/admin/AdminVisitorAnalytics"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<IsLoading />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <Outlet />
              </ProtectedRoute>
            }>

              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="kamar" element={<AdminKamar />} />
              <Route path="kamar/tambah" element={<AdminKamarTambah />} />
              <Route path="kamar/edit/:id" element={<AdminKamarEdit />} />
              <Route path="penghuni" element={<AdminPenghuni />} />
              <Route path="penghuni/tambah" element={<AdminTambahPenghuni />} />
              <Route path="laporan" element={<AdminLaporanKeuangan />} />
              <Route path="tagihan" element={<AdminTagihan />} />
              <Route path="tamu" element={<AdminTamu />} />
              <Route path="keluhan" element={<AdminKeluhan />} />
              <Route path="visitor-analytics" element={<AdminVisitorAnalytics />} />
              <Route path="profil" element={<AdminProfil />} />
              <Route path="penghuni/perpanjang/:id" element={<AdminPenghuniPerpanjang />} />
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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
