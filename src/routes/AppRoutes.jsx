import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. IMPORT KOMPONEN (Pastikan path dan nama file sesuai dengan struktur folder lu)
import Login from "../pages/auth/Login";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardPegawai from "../pages/pegawai/DashboardPegawai"; // FIX: Disamakan dengan log git commit lu sebelumnya
import DashboardPimpinan from "../pages/pimpinan/DashboardPimpinan";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* HALAMAN UTAMA / LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD ADMIN */}
        <Route path="/admin" element={<DashboardAdmin />} />

        {/* DASHBOARD PEGAWAI */}
        {/* FIX: Path diubah ke "/dashboard-pegawai" agar sinkron dengan fungsi navigate() di Login.jsx */}
        {/* FIX: Element disesuaikan dengan nama komponen yang di-import di atas */}
        <Route path="/dashboard-pegawai" element={<DashboardPegawai />} />

        {/* DASHBOARD PIMPINAN */}
        <Route path="/pimpinan" element={<DashboardPimpinan />} />

      </Routes>
    </BrowserRouter>
  );
}