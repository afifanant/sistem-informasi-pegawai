import { BrowserRouter, Routes, Route } from "react-router-dom";

// LOGIN
import Login from "../pages/auth/Login";

// ADMIN
import DashboardAdmin from "../pages/admin/DashboardAdmin";

// PEGAWAI
import PegawaiDashboard from "../pages/pegawai/PegawaiDashboard";

// PIMPINAN
import PimpinanDashboard from "../pages/pimpinan/DashboardPimpinan";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<DashboardAdmin />}
        />

        {/* PEGAWAI */}
        <Route
          path="/pegawai"
          element={<DashboardPegawai />}
        />

        {/* PIMPINAN */}
        <Route
          path="/pimpinan"
          element={<DashboardPimpinan />}
        />

      </Routes>
    </BrowserRouter>
  );
}