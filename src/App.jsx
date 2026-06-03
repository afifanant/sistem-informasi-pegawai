import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AbsensiAdmin from "./pages/admin/AbsensiAdmin";
import DataPegawai from "./pages/admin/DataPegawai";
import Divisi from "./pages/admin/Divisi";
import AdminLaporan from "./pages/admin/Laporan";
import Pengaturan from "./pages/admin/Pengaturan";

import DashboardPegawai from "./pages/pegawai/DashboardPegawai";
import AbsensiPegawai from "./pages/pegawai/AbsensiPegawai";
import TugasSaya from "./pages/pegawai/TugasSaya";
import ProfilePegawai from "./pages/pegawai/ProfilePegawai";

import DashboardPimpinan from "./pages/pimpinan/DashboardPimpinan";
import Monitoring from "./pages/pimpinan/Monitoring";
import Statistik from "./pages/pimpinan/Statistik";
import PimpinanLaporan from "./pages/pimpinan/Laporan";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ADMIN */}
        <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <DashboardAdmin />
    </ProtectedRoute>
  }
/>
        <Route path="/admin/pegawai" element={<DataPegawai />} />
        <Route path="/admin/absensi" element={<AbsensiAdmin />} />
        <Route path="/admin/divisi" element={<Divisi />} />
        <Route path="/admin/laporan" element={<AdminLaporan />} />
<Route path="/admin/pengaturan" element={<Pengaturan />} />

        {/* PEGAWAI */}
        <Route
  path="/pegawai"
  element={
    <ProtectedRoute>
      <DashboardPegawai />
    </ProtectedRoute>
  }
/>
        <Route path="/pegawai/absensi" element={<AbsensiPegawai />} />
        <Route path="/pegawai/tugas" element={<TugasSaya />} />
        <Route path="/pegawai/profile" element={<ProfilePegawai />} />

        {/* PIMPINAN */}
        <Route
  path="/pimpinan"
  element={
    <ProtectedRoute>
      <DashboardPimpinan />
    </ProtectedRoute>
  }
/>
        <Route path="/pimpinan/monitoring" element={<Monitoring />} />
        <Route path="/pimpinan/statistik" element={<Statistik />} />
        <Route path="/pimpinan/laporan" element={<PimpinanLaporan />} />

      </Routes>
    </BrowserRouter>
  );
}