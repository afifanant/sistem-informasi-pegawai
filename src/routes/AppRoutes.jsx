import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. IMPORT KOMPONEN (Pastikan path dan nama file sesuai dengan struktur folder lu)
import Login from "../pages/auth/Login";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardPimpinan from "../pages/pimpinan/DashboardPimpinan";

// IMPORT HALAMAN PEGAWAI
import DashboardPegawai from "../pages/pegawai/DashboardPegawai"; 
import AbsensiPegawai from "../pages/pegawai/AbsensiPegawai"; // Kolom Absen + Hitung Radius & OpenStreetMap
import ProjekPegawai from "../pages/pegawai/ProjekPegawai";   // Daftar Projek + Tanggal & Tempat dari Supabase


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* HALAMAN UTAMA / LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD ADMIN */}
        <Route path="/admin" element={<DashboardAdmin />} />

        {/* DASHBOARD PEGAWAI (Grup rute sesuai dengan path di SidebarPegawai) */}
        <Route path="/pegawai" element={<DashboardPegawai />} />
        <Route path="/pegawai/absensi" element={<AbsensiPegawai />} />
        <Route path="/pegawai/projek" element={<ProjekPegawai />} />
        
                
        {/* FIX CADANGAN: Tetap mempertahankan path ini jika file Login.jsx lu masih mengarah ke /dashboard-pegawai */}
        <Route path="/dashboard-pegawai" element={<DashboardPegawai />} />

        {/* DASHBOARD PIMPINAN */}
        <Route path="/pimpinan" element={<DashboardPimpinan />} />

      </Routes>
    </BrowserRouter>
  );
}